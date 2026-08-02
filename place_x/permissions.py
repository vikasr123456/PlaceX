from rest_framework.permissions import BasePermission


class IsAuthenticatedAndActive(BasePermission):
    """Allow access only to authenticated users with active accounts."""

    message = 'Authentication credentials were not provided or the account is inactive.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
        )


class IsRecruiterOrStaff(BasePermission):
    """Allow access only to recruiters or staff users."""

    message = 'Only recruiters or staff can perform this action.'

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated and request.user.is_active):
            return False
        if request.user.is_staff:
            return True
        role = getattr(getattr(request.user, 'user_profile', None), 'role', '')
        return role == 'recruiter'
