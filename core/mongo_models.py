from pymongo import MongoClient
from django.conf import settings


class MongoDBClient:
    """Singleton MongoDB client for Atlas connection"""
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    @property
    def client(self):
        if self._client is None:
            self._client = MongoClient(settings.MONGO_URI)
        return self._client

    @property
    def db(self):
        if self._db is None:
            self._db = self.client[settings.MONGO_DB_NAME]
        return self._db


def get_mongo_collection(collection_name):
    """Get a MongoDB collection"""
    mongo = MongoDBClient()
    return mongo.db[collection_name]


class ResumeDocument:
    """MongoDB document model for storing parsed resume data"""
    
    @staticmethod
    def collection():
        return get_mongo_collection('resume_documents')
    
    @staticmethod
    def create(data):
        """Create a new resume document"""
        doc = {
            'user_id': data.get('user_id'),
            'user_email': data.get('user_email'),
            'file_name': data.get('file_name'),
            'uploaded_at': data.get('uploaded_at'),
            'raw_text': data.get('raw_text', ''),
            'skills': data.get('skills', []),
            'experience': data.get('experience', []),
            'education': data.get('education', []),
            'summary': data.get('summary', ''),
            'keywords': data.get('keywords', []),
            'match_score': data.get('match_score', 0.0),
            'file_size': data.get('file_size', 0),
            'file_type': data.get('file_type', 'unknown'),
            'parsing_status': data.get('parsing_status', 'pending'),
            'error_message': data.get('error_message', ''),
            'celery_task_id': data.get('celery_task_id', ''),
        }
        result = ResumeDocument.collection().insert_one(doc)
        doc['_id'] = result.inserted_id
        return doc
    
    @staticmethod
    def get_by_user(user_id):
        """Get all resumes for a user"""
        return list(ResumeDocument.collection().find({'user_id': user_id}))
    
    @staticmethod
    def get_by_id(resume_id):
        """Get a resume by ID"""
        return ResumeDocument.collection().find_one({'_id': resume_id})
    
    @staticmethod
    def update(resume_id, data):
        """Update a resume document"""
        return ResumeDocument.collection().update_one(
            {'_id': resume_id},
            {'$set': data}
        )


class JobMatch:
    """MongoDB document model for storing job-resume match results"""
    
    @staticmethod
    def collection():
        return get_mongo_collection('job_matches')
    
    @staticmethod
    def create(data):
        """Create a new job match"""
        doc = {
            'resume_id': data.get('resume_id'),
            'job_id': data.get('job_id'),
            'user_id': data.get('user_id'),
            'match_score': data.get('match_score', 0.0),
            'matched_skills': data.get('matched_skills', []),
            'missing_skills': data.get('missing_skills', []),
            'similarity_score': data.get('similarity_score', 0.0),
            'relevance_score': data.get('relevance_score', 0.0),
            'calculated_at': data.get('calculated_at'),
        }
        result = JobMatch.collection().insert_one(doc)
        doc['_id'] = result.inserted_id
        return doc
    
    @staticmethod
    def get_by_user(user_id):
        """Get all job matches for a user"""
        return list(JobMatch.collection().find({'user_id': user_id}).sort('match_score', -1))
    
    @staticmethod
    def get_by_resume_and_job(resume_id, job_id):
        """Get a match by resume and job ID"""
        return JobMatch.collection().find_one({'resume_id': resume_id, 'job_id': job_id})
