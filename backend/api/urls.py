from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/verify-email/', views.verify_email, name='verify_email'),
    path('auth/verify-email/<str:token>/', views.verify_email_token, name='verify_email_token'),
    path('auth/resend-verification/', views.resend_verification, name='resend_verification'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),
    path('auth/reset-password/', views.reset_password, name='reset_password'),
    path('auth/profile/', views.get_user_profile, name='user_profile'),
]