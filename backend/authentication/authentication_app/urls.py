from django.urls import path
from .views import FortyTwoOAuthRedirect, FortyTwoOAuthCallback, VerifyToken, Verify2FACodeView, Toggle2FAView

urlpatterns = [
    path('42/login/', FortyTwoOAuthRedirect.as_view(), name='42_login'),
    path('42/callback/', FortyTwoOAuthCallback.as_view(), name='42_callback'),
    path('verify-token/', VerifyToken.as_view(), name='verify_token'),
    path('2fa/verify/', Verify2FACodeView.as_view(), name='verify_2fa_code'),
    path('2fa/toggle/', Toggle2FAView.as_view(), name='toggle_2fa'),
]
