from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/welcome/', views.welcome_api, name='welcome_api'),
    path('api/auth/', include('place_x.auth_urls')),
    path('api/', include('core.urls')),
]
