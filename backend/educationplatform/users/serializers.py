from rest_framework import serializers
from users.models import User, TgInvitation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')


class TgInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TgInvitation
        fields = ('id', 'inv_token', 'user')
        read_only_fields = ['inv_token']
