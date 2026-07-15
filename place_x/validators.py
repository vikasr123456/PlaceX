import re

from django.contrib.auth import get_user_model
from django.core.validators import EmailValidator
from rest_framework import serializers

User = get_user_model()

USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_.-]{3,150}$')
EMAIL_VALIDATOR = EmailValidator(message='Enter a valid email address.')


def normalize_email(value: str) -> str:
    return value.lower().strip()


def normalize_username(value: str) -> str:
    return value.strip()


def validate_username_format(value: str) -> str:
    username = normalize_username(value)
    if not USERNAME_PATTERN.match(username):
        raise serializers.ValidationError(
            'Username must be 3-150 characters and may contain letters, numbers, dots, hyphens, and underscores.'
        )
    return username


def validate_unique_username(value: str, *, exclude_pk=None) -> str:
    username = validate_username_format(value)
    queryset = User.objects.filter(username__iexact=username)
    if exclude_pk is not None:
        queryset = queryset.exclude(pk=exclude_pk)
    if queryset.exists():
        raise serializers.ValidationError('A user with this username already exists.')
    return username


def validate_unique_email(value: str, *, exclude_pk=None) -> str:
    email = normalize_email(value)
    EMAIL_VALIDATOR(email)
    queryset = User.objects.filter(email__iexact=email)
    if exclude_pk is not None:
        queryset = queryset.exclude(pk=exclude_pk)
    if queryset.exists():
        raise serializers.ValidationError('A user with this email already exists.')
    return email


def validate_passwords_match(password: str, password_confirm: str, confirm_field: str = 'password_confirm') -> None:
    if password != password_confirm:
        raise serializers.ValidationError({confirm_field: 'Passwords do not match.'})


def validate_identifier(value: str) -> str:
    identifier = value.strip()
    if not identifier:
        raise serializers.ValidationError('This field may not be blank.')
    return identifier
