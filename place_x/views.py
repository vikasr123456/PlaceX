from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .permissions import IsAuthenticatedAndActive
from .serializers import (
    LoginSerializer,
    PasswordChangeSerializer,
    RegisterSerializer,
    UserSerializer,
)


def _auth_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


@api_view(['GET'])
@permission_classes([AllowAny])
def welcome_api(request):
    """Returns a simple welcome message and status indicator for testing connection."""
    return Response({
        'success': True,
        'message': 'Welcome to PlaceX API!',
        'status': 'online',
        'features_available': [
            'JWT Authentication (register, login, refresh, logout)',
            'User profile management',
            'Resume Parsing (MongoDB & Djongo)',
            'Asynchronous Task Queue (Celery & Redis)',
            'Relational Storage (PostgreSQL)',
        ],
    })


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = serializer.save()
        return Response(
            {'success': True, **_auth_tokens(user)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, **_auth_tokens(serializer.validated_data['user'])})


class LogoutView(APIView):
    permission_classes = [IsAuthenticatedAndActive]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'success': False, 'errors': {'refresh': ['This field is required.']}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            RefreshToken(refresh_token).blacklist()
        except Exception:
            return Response(
                {'success': False, 'errors': {'refresh': ['Invalid or expired refresh token.']}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({'success': True, 'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticatedAndActive]

    def get(self, request):
        return Response({'success': True, 'user': UserSerializer(request.user).data})

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True, 'user': serializer.data})


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticatedAndActive]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        return Response({'success': True, 'detail': 'Password changed successfully.'})
