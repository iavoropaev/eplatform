from django.db import connection
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from classes.models import Class, Invitation, Message
from classes.serializers import ClassSerializer, InvitationSerializer, ClassSerializerForTeacher, ClassCreateSerializer, \
    MessageSerializer, MessageCreateSerializer


class ClassesViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def get_permissions(self):
        if self.action in []:
            permission_classes = [AllowAny]
        elif self.action in ['create_class', 'create_invitation', 'delete_invitation', 'create_message',
                             'activate_invitation', 'get_my_classes', 'get_class_data', 'get-student-messages',
                             'delete_message']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='get-class-data')
    def get_class_data(self, request):
        try:
            cur_user_id = request.user.id
            cur_class_id = request.GET.get('class_id')
            cur_class = Class.objects.filter(id=cur_class_id).get()
            serializer = ClassSerializerForTeacher(cur_class)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Error',
            }, status=400)

    @action(detail=False, methods=['get'], url_path='get-my-classes')
    def get_my_classes(self, request):
        cur_user_id = request.user.id
        classes = Class.objects.all().filter(created_by=cur_user_id)
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='get-student-messages')
    def get_student_messages(self, request):
        cur_user_id = request.user.id
        classes_id = list(request.user.student_classes.values_list('id', flat=True))
        messages = Message.objects.select_related('mes_class').filter(mes_class_id__in=classes_id).order_by(
            '-created_at')
        print(messages)
        serializer = MessageSerializer(messages, many=True)
        print(f"Количество SQL-запросов: {len(connection.queries)}")
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='create-class')
    def create_class(self, request):
        try:
            cur_user_id = request.user.id
            data = request.data | {'created_by': cur_user_id}
            serializer = ClassCreateSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось создать класс.',
            }, status=400)

    @action(detail=False, methods=['post'], url_path='create-invitation')
    def create_invitation(self, request):
        try:
            cur_user_id = request.user.id
            is_admin = request.user.is_staff
            class_id = request.data['class_id']
            cur_class = Class.objects.filter(id=class_id).get()

            if (not is_admin) and (cur_user_id != cur_class.created_by.id):
                return Response({'Error': 'Доступ запрещён.'}, status=406)

            inv_data = {"inv_class": cur_class.id}
            serializer = InvitationSerializer(data=inv_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось создать приглашение.',
            })

    @action(detail=False, methods=['post'], url_path='delete-invitation')
    def delete_invitation(self, request):
        try:
            cur_user_id = request.user.id
            is_admin = request.user.is_staff
            invitation_id = request.data['invitation_id']
            invitation = Invitation.objects.filter(id=invitation_id).get()
            if (not is_admin) and (cur_user_id != invitation.inv_class.created_by.id):
                return Response({'Error': 'Доступ запрещён.'}, status=406)
            invitation.delete()

            return Response("ok")
        except Exception as e:
            print(e)
            return Response(status=400)

    @action(detail=False, methods=['post'], url_path='activate-invitation')
    def activate_invitation(self, request):
        try:
            cur_user_id = request.user.id
            is_admin = request.user.is_staff

            inv_token = request.data['token']
            inv = Invitation.objects.filter(token=inv_token).get()
            class_ = inv.inv_class
            if class_.students.filter(id=cur_user_id).exists():
                return Response({'Error': 'Вы уже добавлены в класс.'}, status=400)
            a = class_.students.add(cur_user_id)
            return Response("ok")

        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось активировать приглашение.',
            }, status=400)

    @action(detail=False, methods=['post'], url_path='create-message')
    def create_message(self, request):
        try:
            cur_user_id = request.user.id
            class_id = request.data['class_id']
            cur_class = Class.objects.filter(id=class_id).get()

            if cur_user_id != cur_class.created_by.id:
                return Response({'Error': 'Доступ запрещён.'}, status=406)

            data = {'content': request.data['content'], 'mes_class': cur_class.id}
            print(data)
            serializer = MessageCreateSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось создать приглашение.',
            }, status=400)

    @action(detail=False, methods=['post'], url_path='delete-message')
    def delete_message(self, request):
        try:
            cur_user_id = request.user.id
            message_id = request.data['message_id']
            message = Message.objects.filter(id=message_id).get()
            author = message.mes_class.created_by.id
            print(author)
            if cur_user_id != author:
                return Response({'Error': 'Доступ запрещён.'}, status=406)
            message.delete()
            return Response('deleted')
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось создать приглашение.',
            }, status=400)
