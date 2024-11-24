import requests
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

from educationplatform.settings import VK_APP_TOKEN, VK_APP_VERSION, VK_LINK_EXCHANGE_SILENT_TOKEN, \
    VK_LINK_GET_USER_INFO


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
                                        'fields': 'photo_50,sex,home_town,screen_name,bdate,domain',
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
            user.sex = user_info.get('sex', '')
            user.vk_domain = user_info.get('domain', '')
            user.home_town = user_info.get('home_town', '')
            user.birthday = user_info.get('bdate', '')
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'first_name': user_info.get('first_name', ''),
            'last_name': user_info.get('last_name', ''),
            'photo_50': user_info.get('photo_50', ''),
            'sex': user_info.get('sex', ''),
        })
    except:
        return Response({
            'error': 'Authorization failed.',
        }, status=406)
