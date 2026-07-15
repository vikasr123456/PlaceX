from djongo import models


class ResumeDocument(models.Model):
    """MongoDB model for storing parsed resume data"""
    
    # Basic Information
    user_id = models.IntegerField()
    user_email = models.EmailField()
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # Parsed Content
    raw_text = models.TextField()
    skills = models.JSONField(default=list)  # List of skills extracted
    experience = models.JSONField(default=list)  # List of experience entries
    education = models.JSONField(default=list)  # List of education entries
    
    # Analysis Results
    summary = models.TextField(blank=True)
    keywords = models.JSONField(default=list)  # Important keywords
    match_score = models.FloatField(default=0.0)  # Job match score
    
    # Metadata
    file_size = models.IntegerField()
    file_type = models.CharField(max_length=50)  # pdf, docx, etc.
    parsing_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    error_message = models.TextField(blank=True)
    
    # Celery Task Tracking
    celery_task_id = models.CharField(max_length=255, blank=True)
    
    class Meta:
        managed = False  # Djongo will manage this in MongoDB
        db_table = 'resume_documents'
    
    def __str__(self):
        return f"{self.file_name} - {self.user_email}"


class JobMatch(models.Model):
    """MongoDB model for storing job-resume match results"""
    
    resume_id = models.ObjectIdField()
    job_id = models.IntegerField()
    user_id = models.IntegerField()
    
    # Match Details
    match_score = models.FloatField()
    matched_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    
    # Analysis
    similarity_score = models.FloatField(default=0.0)
    relevance_score = models.FloatField(default=0.0)
    
    # Timestamps
    calculated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = False
        db_table = 'job_matches'
        indexes = [
            models.Index(fields=['user_id', 'job_id']),
            models.Index(fields=['match_score']),
        ]
    
    def __str__(self):
        return f"Match: User {self.user_id} - Job {self.job_id} ({self.match_score}%)"
