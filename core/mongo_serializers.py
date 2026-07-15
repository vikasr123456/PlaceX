from rest_framework import serializers
from .mongo_models import ResumeDocument, JobMatch


class ResumeDocumentSerializer(serializers.Serializer):
    """Serializer for MongoDB resume documents"""
    
    id = serializers.CharField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    user_email = serializers.EmailField(read_only=True)
    file_name = serializers.CharField(max_length=255)
    uploaded_at = serializers.DateTimeField(read_only=True)
    
    raw_text = serializers.CharField(required=False)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    experience = serializers.ListField(child=serializers.DictField(), required=False)
    education = serializers.ListField(child=serializers.DictField(), required=False)
    
    summary = serializers.CharField(required=False)
    keywords = serializers.ListField(child=serializers.CharField(), required=False)
    match_score = serializers.FloatField(required=False)
    
    file_size = serializers.IntegerField(read_only=True)
    file_type = serializers.CharField(max_length=50, read_only=True)
    parsing_status = serializers.CharField(read_only=True)
    error_message = serializers.CharField(required=False)
    
    celery_task_id = serializers.CharField(read_only=True)
    
    def create(self, validated_data):
        return ResumeDocument.objects.create(**validated_data)


class JobMatchSerializer(serializers.Serializer):
    """Serializer for MongoDB job matches"""
    
    id = serializers.CharField(read_only=True)
    resume_id = serializers.CharField(read_only=True)
    job_id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    
    match_score = serializers.FloatField(read_only=True)
    matched_skills = serializers.ListField(child=serializers.CharField(), read_only=True)
    missing_skills = serializers.ListField(child=serializers.CharField(), read_only=True)
    
    similarity_score = serializers.FloatField(read_only=True)
    relevance_score = serializers.FloatField(read_only=True)
    
    calculated_at = serializers.DateTimeField(read_only=True)
