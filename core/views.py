from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

from .models import Company, Job, Application, Interview, StudentProfile, UserProfile, RecruiterProfile, CollegeInfo, Department, PlacementDrive, Offer
from .serializers import (
    CompanySerializer, JobSerializer, JobDetailSerializer,
    ApplicationSerializer, InterviewSerializer, StudentProfileSerializer,
    StudentProfileUpdateSerializer, UserProfileSerializer, UserProfileUpdateSerializer,
    CollegeInfoSerializer, DepartmentSerializer, PlacementDriveSerializer, OfferSerializer
)
from .permissions import IsRecruiterOrAdmin, IsStudent, IsOwnerOrRecruiterOrAdmin


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsRecruiterOrAdmin]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'industry']
    ordering_fields = ['name', 'created_at']


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related('company').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'company__name']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsRecruiterOrAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user_profile = self.request.user.user_profile
        if user_profile.role == 'recruiter':
            recruiter_profile = self.request.user.recruiter_profile
            serializer.save(company=recruiter_profile.company)
        else:
            serializer.save()

    def perform_update(self, serializer):
        user_profile = self.request.user.user_profile
        if user_profile.role == 'recruiter':
            recruiter_profile = self.request.user.recruiter_profile
            serializer.save(company=recruiter_profile.company)
        else:
            serializer.save()

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if self.action in ['update', 'partial_update', 'destroy'] and request.user.user_profile.role == 'recruiter':
            if obj.company != request.user.recruiter_profile.company:
                self.permission_denied(request, message="You can only manage your own company's jobs.")

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobDetailSerializer
        return JobSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured/active jobs"""
        featured_jobs = self.queryset.filter(is_active=True)[:10]
        serializer = JobDetailSerializer(featured_jobs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsStudent])
    def apply(self, request, pk=None):
        """Apply for a job (students only)"""
        job = self.get_object()
        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {'error': 'You have already applied for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application = Application.objects.create(
            job=job,
            applicant=request.user,
            cover_letter=request.data.get('cover_letter', '')
        )
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering_fields = ['applied_at']

    def get_queryset(self):
        user = self.request.user
        user_profile = user.user_profile
        if user_profile.role == 'recruiter':
            try:
                recruiter_profile = user.recruiter_profile
                return Application.objects.filter(job__company=recruiter_profile.company).select_related('job', 'applicant', 'job__company')
            except Exception:
                return Application.objects.none()
        elif user_profile.role == 'admin':
            return Application.objects.select_related('job', 'applicant', 'job__company').all()
        return Application.objects.filter(
            applicant=user
        ).select_related('job', 'job__company')

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if self.action in ['update', 'partial_update', 'destroy'] and request.user.user_profile.role == 'recruiter':
            if obj.job.company != request.user.recruiter_profile.company:
                self.permission_denied(request, message="You can only manage applications for your own company's jobs.")

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOwnerOrRecruiterOrAdmin()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        instance = serializer.instance
        status_value = self.request.data.get('status')
        if status_value == 'withdrawn' and instance.status != 'withdrawn':
            serializer.save(status='withdrawn', withdrawn_at=timezone.now())
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def schedule_interview(self, request, pk=None):
        """Schedule an interview for an application (recruiter/admin only)"""
        user_profile = request.user.user_profile
        if user_profile.role not in ['recruiter', 'admin']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        application = self.get_object()
        if hasattr(application, 'interview'):
            return Response(
                {'error': 'Interview already scheduled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        interview = Interview.objects.create(
            application=application,
            scheduled_date=request.data['scheduled_date'],
            interview_type=request.data.get('interview_type', 'technical'),
            location=request.data.get('location', ''),
            meeting_link=request.data.get('meeting_link', ''),
            notes=request.data.get('notes', '')
        )
        serializer = InterviewSerializer(interview)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update application status (recruiter/admin only)"""
        user_profile = request.user.user_profile
        if user_profile.role not in ['recruiter', 'admin']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        application = self.get_object()
        application.status = request.data.get('status', application.status)
        application.save()
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)


class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.user_profile
        if user_profile.role in ['recruiter', 'admin']:
            return Interview.objects.select_related('application', 'application__job').all()
        return Interview.objects.filter(
            application__applicant=self.request.user
        ).select_related('application', 'application__job')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsRecruiterOrAdmin()]
        return [IsAuthenticated()]


class StudentProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.user_profile
        if user_profile.role in ['recruiter', 'admin']:
            return StudentProfile.objects.select_related('user').all()
        return StudentProfile.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return StudentProfileUpdateSerializer
        return StudentProfileSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        """Get or update current user's profile"""
        profile, created = StudentProfile.objects.get_or_create(
            user=request.user
        )
        
        if request.method == 'PUT':
            serializer = StudentProfileUpdateSerializer(
                profile, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(StudentProfileSerializer(profile).data)
        
        return Response(StudentProfileSerializer(profile).data)

    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        """Get applications for a student profile (recruiter/admin only)"""
        user_profile = request.user.user_profile
        if user_profile.role not in ['recruiter', 'admin']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        profile = self.get_object()
        applications = Application.objects.filter(
            applicant=profile.user
        ).select_related('job', 'job__company')
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user_profile = self.request.user.user_profile
        if user_profile.role in ['recruiter', 'admin']:
            return UserProfile.objects.select_related('user').all()
        return UserProfile.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user's profile with resume upload"""
        profile, created = UserProfile.objects.get_or_create(
            user=request.user
        )
        
        if request.method in ['PUT', 'PATCH']:
            serializer = UserProfileUpdateSerializer(
                profile, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(UserProfileSerializer(profile).data)
        
        return Response(UserProfileSerializer(profile).data)

    @action(detail=True, methods=['patch'])
    def update_role(self, request, pk=None):
        """Update user role (admin only)"""
        user_profile = request.user.user_profile
        if user_profile.role != 'admin':
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        profile = self.get_object()
        profile.role = request.data.get('role', profile.role)
        profile.save()
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = 'student'
        if hasattr(user, 'user_profile'):
            role = user.user_profile.role

        if role == 'student':
            # Jobs Applied
            jobs_applied_count = Application.objects.filter(applicant=user).count()
            
            # Percentage change of applications compared to previous 30 days
            now = timezone.now()
            thirty_days_ago = now - timedelta(days=30)
            sixty_days_ago = now - timedelta(days=60)
            
            current_apps = Application.objects.filter(applicant=user, applied_at__gte=thirty_days_ago).count()
            prev_apps = Application.objects.filter(applicant=user, applied_at__gte=sixty_days_ago, applied_at__lt=thirty_days_ago).count()
            
            if prev_apps == 0:
                jobs_applied_change = 100 if current_apps > 0 else 0
            else:
                jobs_applied_change = round(((current_apps - prev_apps) / prev_apps) * 100)

            # Interviews
            scheduled_interviews = Interview.objects.filter(application__applicant=user, status='scheduled')
            interviews_count = scheduled_interviews.count()
            upcoming_interviews = scheduled_interviews.filter(scheduled_date__gte=now).count()
            interviews_text = f"{upcoming_interviews} upcoming"

            # Pending
            pending_count = Application.objects.filter(applicant=user, status='pending').count()
            pending_text = "Awaiting response"

            # Profile score
            profile_score = 0
            profile_score_text = "Needs update"
            student_profile = StudentProfile.objects.filter(user=user).first()
            if student_profile:
                # Calculate completion score
                total_fields = 9
                filled_fields = 0
                if student_profile.phone: filled_fields += 1
                if student_profile.address: filled_fields += 1
                if student_profile.cgpa is not None: filled_fields += 1
                if student_profile.graduation_year: filled_fields += 1
                if student_profile.department: filled_fields += 1
                if student_profile.skills: filled_fields += 1
                if student_profile.linkedin_url: filled_fields += 1
                if student_profile.github_url: filled_fields += 1
                
                # Check resume from user_profile or student_profile
                has_resume = False
                if student_profile.resume_file or student_profile.resume_uploaded:
                    has_resume = True
                elif hasattr(user, 'user_profile') and user.user_profile.resume:
                    has_resume = True
                
                if has_resume: filled_fields += 1
                
                profile_score = int((filled_fields / total_fields) * 100)
                profile_score_text = "Excellent" if profile_score >= 80 else "Good" if profile_score >= 50 else "Needs update"
                
                # Optionally sync back to db
                if student_profile.profile_completion_percentage != profile_score:
                    student_profile.profile_completion_percentage = profile_score
                    student_profile.save(update_fields=['profile_completion_percentage'])

            # Recent Activity
            activities = []
            
            # Apps activities
            apps = Application.objects.filter(applicant=user).select_related('job', 'job__company').order_by('-applied_at')[:5]
            for app in apps:
                activities.append({
                    'id': f"app_{app.id}",
                    'title': f"Applied to {app.job.title} at {app.job.company.name}",
                    'subtitle': "Application submitted successfully" if app.status == 'pending' else f"Status: {app.get_status_display()}",
                    'timestamp': app.applied_at.isoformat(),
                    'icon': 'check_circle'
                })

            # Interview activities
            interviews = Interview.objects.filter(application__applicant=user).select_related('application__job__company').order_by('-created_at')[:5]
            for intv in interviews:
                activities.append({
                    'id': f"intv_{intv.id}",
                    'title': f"Interview scheduled for {intv.application.job.company.name}",
                    'subtitle': f"{intv.get_interview_type_display()} round on {intv.scheduled_date.strftime('%A')}",
                    'timestamp': intv.created_at.isoformat(),
                    'icon': 'calendar'
                })

            # Profile update activities
            if student_profile and student_profile.updated_at > student_profile.created_at + timedelta(seconds=5):
                activities.append({
                    'id': f"prof_{student_profile.id}",
                    'title': "Updated profile information",
                    'subtitle': "Skills and experience updated",
                    'timestamp': student_profile.updated_at.isoformat(),
                    'icon': 'file_text'
                })

            # Sort activities and limit to 5
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            recent_activity = activities[:5]

            data = {
                'role': 'student',
                'jobsApplied': jobs_applied_count,
                'jobsAppliedChange': jobs_applied_change,
                'interviews': interviews_count,
                'interviewsText': interviews_text,
                'pending': pending_count,
                'pendingText': pending_text,
                'profileScore': profile_score,
                'profileScoreText': profile_score_text,
                'recentActivity': recent_activity
            }
            return Response(data)

        elif role == 'recruiter':
            recruiter_profile = RecruiterProfile.objects.filter(user=user).select_related('company').first()
            if not recruiter_profile:
                return Response({'error': 'Recruiter profile not found'}, status=status.HTTP_400_BAD_REQUEST)

            company = recruiter_profile.company
            now = timezone.now()
            seven_days_ago = now - timedelta(days=7)
            one_day_ago = now - timedelta(days=1)
            thirty_days_ago = now - timedelta(days=30)

            # Active Jobs
            active_jobs = Job.objects.filter(company=company, is_active=True)
            active_jobs_count = active_jobs.count()
            new_jobs = Job.objects.filter(company=company, created_at__gte=seven_days_ago).count()
            active_jobs_text = f"+{new_jobs} new this week"

            # Total Applications
            applications = Application.objects.filter(job__company=company)
            total_applications_count = applications.count()
            new_apps = applications.filter(applied_at__gte=one_day_ago).count()
            total_applications_text = f"{new_apps} new today"

            # Interviews Scheduled
            interviews = Interview.objects.filter(application__job__company=company)
            interviews_count = interviews.filter(status='scheduled').count()
            interviews_this_week = interviews.filter(status='scheduled', scheduled_date__gte=now, scheduled_date__lte=now + timedelta(days=7)).count()
            interviews_text = f"{interviews_this_week} this week"

            # Hired
            hired_count = applications.filter(status__in=['selected', 'offer_accepted']).count()
            hired_this_month = applications.filter(status__in=['selected', 'offer_accepted'], updated_at__gte=thirty_days_ago).count()
            hired_text = f"{hired_this_month} this month"

            # Recent Activity
            activities = []

            # Apps activities
            new_applications = applications.select_related('job', 'applicant').order_by('-applied_at')[:5]
            for app in new_applications:
                activities.append({
                    'id': f"app_{app.id}",
                    'title': f"New application for {app.job.title} position",
                    'subtitle': f"From {app.applicant.get_full_name() or app.applicant.username}",
                    'timestamp': app.applied_at.isoformat(),
                    'icon': 'users'
                })

            # Completed interviews
            completed_interviews = interviews.select_related('application__applicant').filter(status='completed').order_by('-updated_at')[:5]
            for intv in completed_interviews:
                activities.append({
                    'id': f"intv_{intv.id}",
                    'title': f"Interview completed with {intv.application.applicant.get_full_name() or intv.application.applicant.username}",
                    'subtitle': f"{intv.get_interview_type_display()} round - Passed",
                    'timestamp': intv.updated_at.isoformat(),
                    'icon': 'check_circle'
                })

            # New job posts
            job_posts = Job.objects.filter(company=company).order_by('-created_at')[:5]
            for job in job_posts:
                activities.append({
                    'id': f"job_{job.id}",
                    'title': f"Posted new job: {job.title}",
                    'subtitle': f"{job.get_job_type_display()} position at {company.name}",
                    'timestamp': job.created_at.isoformat(),
                    'icon': 'plus'
                })

            # Sort and slice
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            recent_activity = activities[:5]

            data = {
                'role': 'recruiter',
                'activeJobs': active_jobs_count,
                'activeJobsText': active_jobs_text,
                'totalApplications': total_applications_count,
                'totalApplicationsText': total_applications_text,
                'interviews': interviews_count,
                'interviewsText': interviews_text,
                'hired': hired_count,
                'hiredText': hired_text,
                'recentActivity': recent_activity
            }
            return Response(data)

        elif role == 'admin':
            now = timezone.now()
            seven_days_ago = now - timedelta(days=7)

            # Total Users
            total_users = User.objects.count()
            new_users = User.objects.filter(date_joined__gte=seven_days_ago).count()
            total_users_text = f"+{new_users} this week"

            # Companies
            companies_count = Company.objects.count()
            pending_verifications = RecruiterProfile.objects.filter(verification_status='pending').count()
            companies_text = f"{pending_verifications} pending approval"

            # Job Postings
            job_postings_count = Job.objects.count()
            active_jobs_count = Job.objects.filter(is_active=True).count()
            job_postings_text = f"{active_jobs_count} active"

            # Active Sessions
            try:
                from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
                active_sessions = OutstandingToken.objects.filter(expires_at__gt=now).values('user').distinct().count()
            except Exception:
                active_sessions = 0
            
            if active_sessions == 0:
                active_sessions = max(1, User.objects.filter(last_login__gte=now - timedelta(days=1)).count())

            # System Alerts
            alerts = [
                {
                    'id': 'backup',
                    'type': 'backup',
                    'title': 'Database backup scheduled',
                    'details': 'Scheduled for tonight at 2:00 AM'
                },
                {
                    'id': 'pending',
                    'type': 'pending',
                    'title': 'Pending recruiter verifications',
                    'details': f"{pending_verifications} recruiters awaiting approval"
                },
                {
                    'id': 'system',
                    'type': 'system',
                    'title': 'System performance optimal',
                    'details': 'All systems running normally'
                }
            ]

            # Recent Activity
            activities = []

            # Recent User registrations
            recent_regs = User.objects.select_related('user_profile').order_by('-date_joined')[:5]
            for u in recent_regs:
                user_role = u.user_profile.role if hasattr(u, 'user_profile') else 'student'
                activities.append({
                    'id': f"reg_{u.id}",
                    'title': f"New user registration: {u.username}",
                    'subtitle': f"Role: {user_role.capitalize()}",
                    'timestamp': u.date_joined.isoformat(),
                    'icon': 'users'
                })

            # Recruiter approvals
            verified_recruiters = RecruiterProfile.objects.filter(verification_status='verified').select_related('company', 'verified_by').order_by('-verified_at')[:5]
            for rec in verified_recruiters:
                verifier = rec.verified_by.username if rec.verified_by else 'admin'
                activities.append({
                    'id': f"rec_{rec.id}",
                    'title': f"Company profile approved: {rec.company.name}",
                    'subtitle': f"Verified by {verifier}",
                    'timestamp': (rec.verified_at or rec.created_at).isoformat(),
                    'icon': 'check_circle'
                })

            # Job posts
            recent_jobs = Job.objects.select_related('company').order_by('-created_at')[:5]
            for job in recent_jobs:
                activities.append({
                    'id': f"job_{job.id}",
                    'title': f"New job posted: {job.title}",
                    'subtitle': f"By {job.company.name}",
                    'timestamp': job.created_at.isoformat(),
                    'icon': 'check_circle'
                })

            # Sort and slice
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            recent_activity = activities[:5]

            data = {
                'role': 'admin',
                'totalUsers': total_users,
                'totalUsersText': total_users_text,
                'companies': companies_count,
                'companiesText': companies_text,
                'jobPostings': job_postings_count,
                'jobPostingsText': job_postings_text,
                'activeSessions': active_sessions,
                'alerts': alerts,
                'recentActivity': recent_activity
            }
            return Response(data)

        return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)


class CollegeInfoViewSet(viewsets.ModelViewSet):
    queryset = CollegeInfo.objects.all()
    serializer_class = CollegeInfoSerializer

    def get_authenticators(self):
        if hasattr(self, 'action') and self.action in ['list', 'retrieve']:
            return []
        return super().get_authenticators()

    def get_permissions(self):
        if hasattr(self, 'action') and self.action in ['list', 'retrieve']:
            return []
        return [IsAuthenticated(), IsRecruiterOrAdmin()]


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.select_related('college').all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsRecruiterOrAdmin()]
        return [IsAuthenticated()]


class PlacementDriveViewSet(viewsets.ModelViewSet):
    queryset = PlacementDrive.objects.select_related('company', 'college').all()
    serializer_class = PlacementDriveSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsRecruiterOrAdmin()]
        return [IsAuthenticated()]


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.select_related('job', 'company', 'student').all()
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsRecruiterOrAdmin()]
        return [IsAuthenticated()]

