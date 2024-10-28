from django.urls import path
from .views import RegisterView, LoginView, FortyTwoOAuthRedirect, FortyTwoOAuthCallback

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('42/login/', FortyTwoOAuthRedirect.as_view(), name='42_login'),
    path('42/callback/', FortyTwoOAuthCallback.as_view(), name='42_callback'),
]
