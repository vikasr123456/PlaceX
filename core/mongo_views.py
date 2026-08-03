from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime

from .mongo_models import ResumeDocument, JobMatch


class ResumeDocumentViewSet(viewsets.ViewSet):
    """ViewSet for MongoDB resume documents using pymongo"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def list(self, request):
        """Get all resumes for current user"""
        resumes = ResumeDocument.get_by_user(request.user.id)
        # Convert ObjectId to string for JSON serialization
        for resume in resumes:
            resume['_id'] = str(resume['_id'])
        return Response({'success': True, 'resumes': resumes})

    def create(self, request):
        """Upload a new resume"""
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'success': False, 'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = {
            'user_id': request.user.id,
            'user_email': request.user.email,
            'file_name': file.name,
            'file_size': file.size,
            'file_type': file.name.split('.')[-1] if '.' in file.name else 'unknown',
            'uploaded_at': datetime.utcnow(),
            'parsing_status': 'pending',
        }
        
        try:
            doc = ResumeDocument.create(data)
            doc['_id'] = str(doc['_id'])
            return Response({'success': True, 'resume': doc}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        """Get a specific resume"""
        try:
            from bson import ObjectId
            resume = ResumeDocument.get_by_id(ObjectId(pk))
            if resume:
                resume['_id'] = str(resume['_id'])
                return Response({'success': True, 'resume': resume})
            return Response(
                {'success': False, 'error': 'Resume not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def my_resumes(self, request):
        """Get all resumes for current user"""
        return self.list(request)

    @action(detail=True, methods=['get'])
    def parsing_status(self, request, pk=None):
        """Check parsing status of a resume"""
        try:
            from bson import ObjectId
            resume = ResumeDocument.get_by_id(ObjectId(pk))
            if resume:
                return Response({
                    'success': True,
                    'id': str(resume['_id']),
                    'file_name': resume.get('file_name'),
                    'parsing_status': resume.get('parsing_status'),
                    'error_message': resume.get('error_message'),
                    'match_score': resume.get('match_score'),
                })
            return Response(
                {'success': False, 'error': 'Resume not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class JobMatchViewSet(viewsets.ViewSet):
    """ViewSet for MongoDB job matches using pymongo"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Get all job matches for current user"""
        matches = JobMatch.get_by_user(request.user.id)
        # Convert ObjectId to string for JSON serialization
        for match in matches:
            match['_id'] = str(match['_id'])
        return Response({'success': True, 'matches': matches})

    @action(detail=False, methods=['get'])
    def my_matches(self, request):
        """Get all job matches for current user"""
        return self.list(request)

    @action(detail=False, methods=['post'])
    def calculate_match(self, request):
        """Calculate job match for a specific job"""
        resume_id = request.data.get('resume_id')
        job_id = request.data.get('job_id')
        
        if not resume_id or not job_id:
            return Response(
                {'success': False, 'error': 'Both resume_id and job_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # This would trigger a Celery task to calculate the match
        # For now, return a placeholder response
        return Response({
            'success': True,
            'message': 'Match calculation initiated',
            'resume_id': resume_id,
            'job_id': job_id,
            'status': 'processing'
        })
