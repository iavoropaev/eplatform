from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from users.views import auth_by_vk, get_tg_invitation, activate_tg_invitation

urlpatterns = [
    path('auth/', auth_by_vk),

    path('get-tg-invitation/', get_tg_invitation),
    path('activate-tg-invitation/', activate_tg_invitation),


    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
