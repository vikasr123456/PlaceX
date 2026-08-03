from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, JobViewSet, ApplicationViewSet,
    InterviewViewSet, StudentProfileViewSet, UserProfileViewSet,
    DashboardStatsView, CollegeInfoViewSet, DepartmentViewSet,
    PlacementDriveViewSet, OfferViewSet
)
from .mongo_views import ResumeDocumentViewSet, JobMatchViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'interviews', InterviewViewSet, basename='interview')
router.register(r'student-profiles', StudentProfileViewSet, basename='student-profile')
router.register(r'user-profiles', UserProfileViewSet, basename='user-profile')
router.register(r'resumes', ResumeDocumentViewSet, basename='resume')
router.register(r'job-matches', JobMatchViewSet, basename='job-match')
router.register(r'college-info', CollegeInfoViewSet, basename='college-info')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'placement-drives', PlacementDriveViewSet, basename='placement-drive')
router.register(r'offers', OfferViewSet, basename='offer')

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]

