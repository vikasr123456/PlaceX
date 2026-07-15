from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .mongo_models import ResumeDocument, JobMatch
from .mongo_serializers import ResumeDocumentSerializer, JobMatchSerializer


class ResumeDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for MongoDB resume documents"""
    serializer_class = ResumeDocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return ResumeDocument.objects.filter(user_id=self.request.user.id)

    def perform_create(self, serializer):
        # Add user context
        serializer.save(
            user_id=self.request.user.id,
            user_email=self.request.user.email,
            file_size=self.request.FILES.get('file').size if self.request.FILES.get('file') else 0,
            file_type=self.request.FILES.get('file').name.split('.')[-1] if self.request.FILES.get('file') else 'unknown'
        )

    @action(detail=False, methods=['get'])
    def my_resumes(self, request):
        """Get all resumes for current user"""
        resumes = self.get_queryset()
        serializer = self.get_serializer(resumes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def parsing_status(self, request, pk=None):
        """Check parsing status of a resume"""
        resume = self.get_object()
        return Response({
            'id': str(resume.id),
            'file_name': resume.file_name,
            'parsing_status': resume.parsing_status,
            'error_message': resume.error_message,
            'match_score': resume.match_score,
        })


class JobMatchViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for MongoDB job matches"""
    serializer_class = JobMatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobMatch.objects.filter(user_id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def my_matches(self, request):
        """Get all job matches for current user"""
        matches = self.get_queryset().order_by('-match_score')
        serializer = self.get_serializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def calculate_match(self, request):
        """Calculate job match for a specific job"""
        resume_id = request.data.get('resume_id')
        job_id = request.data.get('job_id')
        
        if not resume_id or not job_id:
            return Response(
                {'error': 'Both resume_id and job_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # This would trigger a Celery task to calculate the match
        # For now, return a placeholder response
        return Response({
            'message': 'Match calculation initiated',
            'resume_id': resume_id,
            'job_id': job_id,
            'status': 'processing'
        })
