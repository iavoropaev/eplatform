from rest_framework import serializers

from classes.models import Class, Invitation
from users.serializers import UserSerializer


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'token', 'inv_class', 'created_at']
        read_only_fields = ['token', 'created_at']


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ('id', 'name')

class ClassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ('id', 'name', 'created_by')

class ClassSerializerForTeacher(serializers.ModelSerializer):
    students = UserSerializer(many=True)
    invitations = InvitationSerializer(many=True)
    class Meta:
        model = Class
        fields = ('id', 'name', 'students', 'invitations')


