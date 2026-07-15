from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Company, Job, Application, Interview, StudentProfile, UserProfile
from .serializers import (
    CompanySerializer, JobSerializer, JobDetailSerializer,
    ApplicationSerializer, InterviewSerializer, StudentProfileSerializer,
    StudentProfileUpdateSerializer, UserProfileSerializer, UserProfileUpdateSerializer
)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'industry']
    ordering_fields = ['name', 'created_at']


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related('company').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'company__name']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']

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

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        """Apply for a job"""
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
        if self.request.user.is_staff:
            return Application.objects.select_related('job', 'applicant', 'job__company').all()
        return Application.objects.filter(
            applicant=self.request.user
        ).select_related('job', 'job__company')

    @action(detail=True, methods=['post'])
    def schedule_interview(self, request, pk=None):
        """Schedule an interview for an application (admin only)"""
        if not request.user.is_staff:
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


class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Interview.objects.select_related('application', 'application__job').all()
        return Interview.objects.filter(
            application__applicant=self.request.user
        ).select_related('application', 'application__job')


class StudentProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
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


class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        if self.request.user.is_staff:
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
