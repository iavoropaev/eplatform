import requests
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

from educationplatform.settings import VK_APP_TOKEN, VK_APP_VERSION, VK_LINK_EXCHANGE_SILENT_TOKEN, \
    VK_LINK_GET_USER_INFO
from users.models import User, TgInvitation, Achievement
from users.serializers import TgInvitationSerializer, AchievementSerializer


@extend_schema(description='Authorization via VK ID.')
@api_view(['POST'])
def auth_by_vk(request):
    try:
        silent_token = request.data['token']
        uuid = request.data['uuid']

        response = requests.post(VK_LINK_EXCHANGE_SILENT_TOKEN,
                                 data={
                                     'v': VK_APP_VERSION,
                                     'token': silent_token,
                                     'uuid': uuid,
                                     'access_token': VK_APP_TOKEN,
                                 }).json()['response']

        user_id = response['user_id']
        user_info = requests.post(VK_LINK_GET_USER_INFO,
                                  data={'v': VK_APP_VERSION,
                                        'access_token': VK_APP_TOKEN,
                                        'user_ids': user_id,
                                        'fields': 'photo_50,screen_name,domain',
                                        'lang': 'ru'}).json()['response'][0]

        try:
            # Поиск пользователя в БД
            user = get_user_model().objects.get_by_natural_key(user_id)
        except:
            # Создание пользователя, так как в БД не найден
            user = get_user_model().objects.create_user(username=user_id)
            # Обновление полей и сохранение
            user.first_name = user_info.get('first_name', '')
            user.last_name = user_info.get('last_name', '')
            user.photo = user_info.get('photo_50', '')
            user.vk_domain = user_info.get('domain', '')
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'first_name': user_info.get('first_name', ''),
            'last_name': user_info.get('last_name', ''),
            'photo_50': user_info.get('photo_50', ''),
            'is_admin': user.is_staff
        })
    except:
        return Response({
            'error': 'Authorization failed.',
        }, status=406)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def get_tg_invitation(request):
    try:
        cur_user_id = request.user.id
        user = User.objects.get(id=cur_user_id)

        count_user_invitations = TgInvitation.objects.filter(user=user).count()
        if count_user_invitations == 0:
            invitation = TgInvitation.objects.create(user=user)
        else:
            invitation = TgInvitation.objects.filter(user=user).first()
        serializer = TgInvitationSerializer(invitation)

        return Response(serializer.data, status=200)
    except Exception as e:
        return Response({
            'Error': 'Не удалось создать приглашение.',
        }, status=400)


@api_view(['POST'])
def activate_tg_invitation(request):
    try:
        invitation_token = request.data['invitation']
        tg_id = int(request.data['tg_id'])

        invitation = TgInvitation.objects.get(inv_token=invitation_token)
        user = invitation.user
        user.tg_id = tg_id

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        user.save()
        invitation.delete()
        return Response({'access_token': access_token}, status=200)
    except Exception as e:
        return Response({
            'Error': 'Не удалось создать приглашение.',
        }, status=400)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def get_tg_link_status(request):
    try:
        cur_user_id = request.user.id
        user = User.objects.get(id=cur_user_id)

        if user.tg_id is not None:
            status = True
        else:
            status = False

        return Response(status, status=200)
    except Exception as e:
        return Response({
            'Error': 'Не удалось обработать запрос.',
        }, status=400)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def delete_tg_link(request):
    try:
        cur_user_id = request.user.id
        user = User.objects.get(id=cur_user_id)
        if user.tg_id is None:
            return Response('already-unlinked', status=200)
        user.tg_id = None
        user.save()
        return Response('unlinked', status=200)
    except Exception as e:
        return Response({
            'Error': 'Не удалось обработать запрос.',
        }, status=400)


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer

    def get_permissions(self):
        if self.action in ['get_my_achievements']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], url_path='get-my-achievements')
    def get_my_achievements(self, request):
        try:
            cur_user = request.user
            achievements = cur_user.achievements.all()
            serializer = AchievementSerializer(achievements, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({
                'Error': 'Не удалось создать подборку.',
            }, status=400)
