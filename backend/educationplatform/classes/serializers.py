from rest_framework import serializers

from classes.models import Class, Invitation, Message
from users.serializers import UserSerializer


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ('id', 'name')


class MessageSerializer(serializers.ModelSerializer):
    mes_class = ClassSerializer()

    class Meta:
        model = Message
        fields = ('id', 'content', 'mes_class', 'created_at')


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'content', 'mes_class', 'created_at')


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'token', 'inv_class', 'created_at']
        read_only_fields = ['token', 'created_at']


class ClassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ('id', 'name', 'created_by')


class ClassSerializerForTeacher(serializers.ModelSerializer):
    students = UserSerializer(many=True)
    invitations = InvitationSerializer(many=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ('id', 'name', 'students', 'invitations', 'messages')

    def get_messages(self, obj):
        qs = obj.messages.order_by('-created_at')
        return MessageSerializer(qs, many=True).data
