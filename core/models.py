from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser

User = get_user_model()


class UserProfile(models.Model):
    """Extended user profile with role and additional information"""
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Company(models.Model):
    """Company model for placement drives"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    logo = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Job(models.Model):
    """Job posting model"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=200)
    job_type = models.CharField(
        max_length=20,
        choices=[
            ('full_time', 'Full Time'),
            ('part_time', 'Part Time'),
            ('internship', 'Internship'),
            ('contract', 'Contract'),
        ],
        default='full_time'
    )
    is_active = models.BooleanField(default=True)
    application_deadline = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.company.name}"


class Application(models.Model):
    """Job application model with comprehensive status tracking"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interview_completed', 'Interview Completed'),
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
        ('offer_released', 'Offer Released'),
        ('offer_accepted', 'Offer Accepted'),
        ('offer_rejected', 'Offer Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    cover_letter = models.TextField(blank=True)
    resume_url = models.URLField(blank=True)  # MongoDB document reference
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    withdrawn_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    shortlist_reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['job', 'applicant']
        indexes = [
            models.Index(fields=['applicant', '-applied_at']),
            models.Index(fields=['job', '-applied_at']),
            models.Index(fields=['status', '-applied_at']),
        ]

    def __str__(self):
        return f"{self.applicant.username} - {self.job.title}"


class Interview(models.Model):
    """Interview schedule model"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('rescheduled', 'Rescheduled'),
        ('completed', 'Completed'),
        ('no_show', 'No Show'),
        ('cancelled', 'Cancelled'),
    ]

    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='interview')
    scheduled_date = models.DateTimeField()
    interview_type = models.CharField(
        max_length=20,
        choices=[
            ('technical', 'Technical'),
            ('hr', 'HR'),
            ('managerial', 'Managerial'),
            ('group', 'Group Discussion'),
        ]
    )
    location = models.CharField(max_length=200, blank=True)
    meeting_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    interview_round = models.IntegerField(default=1)
    feedback = models.TextField(blank=True)
    interviewer_name = models.CharField(max_length=200, blank=True)
    interviewer_email = models.EmailField(blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_date']
        indexes = [
            models.Index(fields=['status', 'scheduled_date']),
        ]

    def __str__(self):
        return f"Interview for {self.application.job.title} - Round {self.interview_round}"


class StudentProfile(models.Model):
    """Extended student profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    cgpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    department = models.CharField(max_length=100, blank=True)
    skills = models.TextField(blank=True)  # Comma-separated skills
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    is_placed = models.BooleanField(default=False)
    resume_uploaded = models.BooleanField(default=False)
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    profile_completion_percentage = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s Profile"


class CollegeInfo(models.Model):
    """College/Institution information"""
    name = models.CharField(max_length=300, default='Sri Krishna Institute of Technology')
    short_name = models.CharField(max_length=50, default='SKIT', unique=True)
    description = models.TextField(blank=True)
    logo_url = models.URLField(blank=True)
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=10, blank=True)
    vision = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    principal_name = models.CharField(max_length=200, blank=True)
    principal_email = models.EmailField(blank=True)
    placement_officer_name = models.CharField(max_length=200, blank=True)
    placement_officer_email = models.EmailField(blank=True)
    placement_officer_phone = models.CharField(max_length=20, blank=True)
    founded_year = models.IntegerField(null=True, blank=True)
    accreditation = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'College Info'

    def __str__(self):
        return self.name


class Department(models.Model):
    """Academic departments/branches"""
    college = models.ForeignKey(CollegeInfo, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    hod_name = models.CharField(max_length=200, blank=True)
    hod_email = models.EmailField(blank=True)
    total_seats = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ['college', 'code']

    def __str__(self):
        return f"{self.name} ({self.code})"


class AcademicYear(models.Model):
    """Academic years for the college"""
    college = models.ForeignKey(CollegeInfo, on_delete=models.CASCADE, related_name='academic_years')
    year = models.CharField(max_length=20)  # e.g., '2023-2024'
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-year']
        unique_together = ['college', 'year']

    def __str__(self):
        return f"{self.year} ({self.college.short_name})"


class FacultyProfile(models.Model):
    """Faculty member profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='faculty_profile')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='faculty_members')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    qualification = models.CharField(max_length=200, blank=True)
    specialization = models.CharField(max_length=200, blank=True)
    years_of_experience = models.IntegerField(default=0)
    office_hours = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Dr./Prof. {self.user.get_full_name() or self.user.username}"


class RecruiterProfile(models.Model):
    """Recruiter profile with verification status"""
    VERIFICATION_STATUS = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='recruiters')
    designation = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='pending')
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_recruiters')
    rejection_reason = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.company.name}"


class PlacementDrive(models.Model):
    """Placement drive/recruitment campaign"""
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    college = models.ForeignKey(CollegeInfo, on_delete=models.CASCADE, related_name='placement_drives')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='placement_drives')
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    registration_deadline = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    estimated_positions = models.IntegerField(default=1)
    target_departments = models.ManyToManyField(Department, related_name='placement_drives')
    target_cgpa = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_placement_drives')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.title} - {self.company.name}"


class Offer(models.Model):
    """Job offer to student"""
    STATUS_CHOICES = [
        ('generated', 'Generated'),
        ('sent', 'Sent'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]

    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='offer')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='offers')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offers')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='offers')
    position = models.CharField(max_length=200)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    offer_letter_file = models.FileField(upload_to='offer_letters/', blank=True, null=True)
    offer_letter_url = models.URLField(blank=True)
    joining_date = models.DateField()
    validity_end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='generated')
    acceptance_date = models.DateTimeField(null=True, blank=True)
    rejection_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Offer to {self.student.username} - {self.company.name}"


class Notification(models.Model):
    """User notifications for activities"""
    NOTIFICATION_TYPE_CHOICES = [
        ('application_received', 'Application Received'),
        ('application_status', 'Application Status Update'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('offer_received', 'Offer Received'),
        ('job_posted', 'Job Posted'),
        ('placement_drive', 'Placement Drive'),
        ('general', 'General'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=300)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES, default='general')
    related_job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)
    related_application = models.ForeignKey(Application, on_delete=models.SET_NULL, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    action_url = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class DashboardStatistic(models.Model):
    """Dashboard statistics for various roles"""
    STAT_TYPE_CHOICES = [
        ('student_applications', 'Student Applications'),
        ('student_interviews', 'Student Interviews'),
        ('recruiter_jobs', 'Recruiter Jobs'),
        ('recruiter_applications', 'Recruiter Applications'),
        ('admin_total_students', 'Admin Total Students'),
        ('admin_total_jobs', 'Admin Total Jobs'),
        ('admin_placements', 'Admin Placements'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dashboard_statistics')
    stat_type = models.CharField(max_length=50, choices=STAT_TYPE_CHOICES)
    value = models.IntegerField(default=0)
    label = models.CharField(max_length=200)
    percentage_change = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_updated']
        unique_together = ['user', 'stat_type']

    def __str__(self):
        return f"{self.label} - {self.user.username}"


class AcademicRecord(models.Model):
    """Student academic records/transcripts"""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='academic_records')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.SET_NULL, null=True, blank=True)
    cgpa = models.DecimalField(max_digits=3, decimal_places=2)
    semester = models.IntegerField()
    total_credits = models.IntegerField()
    earned_credits = models.IntegerField()
    record_file = models.FileField(upload_to='academic_records/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-semester']
        unique_together = ['student', 'semester', 'academic_year']

    def __str__(self):
        return f"{self.student.username} - Sem {self.semester} - CGPA: {self.cgpa}"


class PlacementReport(models.Model):
    """Placement statistics and reports"""
    college = models.ForeignKey(CollegeInfo, on_delete=models.CASCADE, related_name='placement_reports')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    total_students = models.IntegerField(default=0)
    placed_students = models.IntegerField(default=0)
    highest_package = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    lowest_package = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    average_package = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total_offers = models.IntegerField(default=0)
    companies_visited = models.IntegerField(default=0)
    report_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-academic_year']
        unique_together = ['college', 'department', 'academic_year']

    def __str__(self):
        dept = self.department.name if self.department else 'All'
        return f"Placement Report {self.academic_year.year} - {dept}"


class ActivityLog(models.Model):
    """System activity log for auditing"""
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('verify', 'Verify'),
        ('reject', 'Reject'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='activity_logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    entity_type = models.CharField(max_length=100)  # e.g., 'Job', 'Application'
    entity_id = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['entity_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.action.upper()} {self.entity_type} by {self.user.username if self.user else 'Anonymous'}"
