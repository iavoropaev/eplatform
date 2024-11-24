from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    photo = models.CharField(null=True, blank=True)
    sex = models.IntegerField(null=True, blank=True)
    vk_domain = models.CharField(null=True, blank=True, unique=True)
    home_town = models.CharField(null=True, blank=True)
    birthday = models.CharField(null=True, blank=True)

    def __str__(self):
        return str(self.vk_domain)
