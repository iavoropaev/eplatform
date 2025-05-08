import uuid

from django.db import models
from educationplatform.settings import AUTH_USER_MODEL


class Class(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False,
                                   related_name='classes')
    name = models.CharField(max_length=100, blank=False)

    students = models.ManyToManyField(AUTH_USER_MODEL, blank=True, related_name='student_classes')

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Класс"
        verbose_name_plural = "Классы"


class Invitation(models.Model):
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    inv_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="invitations")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Приглашение"
        verbose_name_plural = "Приглашения"


class Message(models.Model):
    content = models.CharField(max_length=10000)
    mes_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="messages")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"
