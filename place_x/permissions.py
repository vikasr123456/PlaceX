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
