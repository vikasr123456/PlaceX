from rest_framework import serializers
from core.models import Company, Job, Application, Interview, StudentProfile, UserProfile
from core.models import CollegeInfo, Department, PlacementDrive, Offer


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), write_only=True, required=False)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.user:
            user_profile = getattr(request.user, 'user_profile', None)
            if user_profile and user_profile.role == 'admin':
                if 'company' not in attrs:
                    raise serializers.ValidationError({'company': 'This field is required for admins.'})
        return attrs


class JobDetailSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    applicant_name = serializers.CharField(source='applicant.username', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['id', 'applied_at', 'updated_at']


class InterviewSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='application.job.title', read_only=True)
    applicant_name = serializers.CharField(source='application.applicant.username', read_only=True)

    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['phone', 'address', 'cgpa', 'graduation_year', 'department', 
                  'skills', 'linkedin_url', 'github_url']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'resume', 'phone', 'address']
        read_only_fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'resume', 'phone', 'address']


class CollegeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeInfo
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)

    class Meta:
        model = Department
        fields = '__all__'


class PlacementDriveSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = PlacementDrive
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Offer
        fields = '__all__'
