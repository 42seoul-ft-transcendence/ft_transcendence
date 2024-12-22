from django.urls import path
from .views import OauthRedirect, OauthCallbackView, RefreshTokenView, Verify2FAView, Toggle2FAView, LoginPageView, \
    LogoutView, UpdateStatusMessageView

urlpatterns = [
    path("", LoginPageView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("oauth/redirect/", OauthRedirect.as_view(), name="oauth_redirect"),
    path("oauth/callback/", OauthCallbackView.as_view(), name="oauth_callback"),
    path("verify-2fa", Verify2FAView.as_view(), name="verify_2fa"),
    path("toggle-2fa", Toggle2FAView.as_view(), name="toggle_2fa"),
    path("token/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("status/update/", UpdateStatusMessageView.as_view(), name="status_update"),
]