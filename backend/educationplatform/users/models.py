import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from educationplatform.settings import AUTH_USER_MODEL


class User(AbstractUser):
    photo = models.CharField(null=True, blank=True)
    sex = models.IntegerField(null=True, blank=True)
    vk_domain = models.CharField(null=True, blank=True, unique=True)
    tg_id = models.BigIntegerField(null=True, blank=True)
    home_town = models.CharField(null=True, blank=True)
    birthday = models.CharField(null=True, blank=True)

    def __str__(self):
        return str(self.vk_domain)

class TgInvitation(models.Model):
    inv_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tg_invitations")

    def __str__(self):
        return str(self.user.vk_domain)

    class Meta:
        verbose_name = "ТГ приглашение"
        verbose_name_plural = "ТГ приглашения"


class Achievement(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    users = models.ManyToManyField(User, related_name='achievements', blank=True)

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = "Достижение"
        verbose_name_plural = "Достижения"

