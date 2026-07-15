from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .validators import (
    validate_identifier,
    validate_passwords_match,
    validate_unique_email,
    validate_unique_username,
)


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Validates and creates a new application user."""

    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_email(self, value):
        return validate_unique_email(value)

    def validate_username(self, value):
        return validate_unique_username(value)

    def validate(self, attrs):
        password_confirm = attrs.pop('password_confirm')
        validate_passwords_match(attrs['password'], password_confirm)
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def validate_email(self, value):
        exclude_pk = self.instance.pk if self.instance else None
        return validate_unique_email(value, exclude_pk=exclude_pk)

    def validate_username(self, value):
        exclude_pk = self.instance.pk if self.instance else None
        return validate_unique_username(value, exclude_pk=exclude_pk)


class LoginSerializer(serializers.Serializer):
    """Authenticates with either a username or an email address."""

    identifier = serializers.CharField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False, style={'input_type': 'password'})

    def validate_identifier(self, value):
        return validate_identifier(value)

    def validate(self, attrs):
        identifier = attrs['identifier']
        user = User.objects.filter(email__iexact=identifier).first()
        username = user.username if user else identifier
        authenticated_user = authenticate(
            request=self.context.get('request'),
            username=username,
            password=attrs['password'],
        )
        if not authenticated_user:
            raise serializers.ValidationError('Invalid credentials.', code='authorization')
        if not authenticated_user.is_active:
            raise serializers.ValidationError('This account is inactive.', code='authorization')
        attrs['user'] = authenticated_user
        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    new_password_confirm = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate(self, attrs):
        validate_passwords_match(
            attrs['new_password'],
            attrs['new_password_confirm'],
            confirm_field='new_password_confirm',
        )
        if attrs['current_password'] == attrs['new_password']:
            raise serializers.ValidationError(
                {'new_password': 'New password must be different from the current password.'}
            )
        validate_password(attrs['new_password'], self.context['request'].user)
        return attrs
