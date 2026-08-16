from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class WelcomeAPITests(APITestCase):
    """Tests the Welcome API endpoint."""

    def test_welcome_api_success(self):
        url = reverse('welcome_api')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['status'], 'online')


class AuthAPITests(APITestCase):
    """Tests authentication endpoints including registration and login."""

    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_data = {
            'username': 'teststudent',
            'email': 'student@skit.edu.in',
            'first_name': 'Test',
            'last_name': 'Student',
            'password': 'SecurePassword123',
            'password_confirm': 'SecurePassword123'
        }

    def test_user_registration_and_login_flow(self):
        # 1. Test registration
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], 'teststudent')

        # 2. Test login with registered credentials
        login_data = {
            'identifier': 'student@skit.edu.in',
            'password': 'SecurePassword123'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertTrue(login_response.data['success'])
        self.assertIn('access', login_response.data)
        self.assertIn('refresh', login_response.data)
