from rest_framework import permissions


class IsRecruiterOrAdmin(permissions.BasePermission):
    """Allow access only to recruiters or admins"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.user_profile.role in ['recruiter', 'admin']
        )


class IsStudent(permissions.BasePermission):
    """Allow access only to students"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.user_profile.role == 'student'
        )


class IsOwnerOrRecruiterOrAdmin(permissions.BasePermission):
    """Allow access to owner, recruiter, or admin"""
    def has_object_permission(self, request, view, obj):
        if request.user.user_profile.role in ['recruiter', 'admin']:
            return True
        return obj.applicant == request.user
