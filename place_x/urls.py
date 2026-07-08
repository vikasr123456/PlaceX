from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/welcome/', views.welcome_api, name='welcome_api'),
]
