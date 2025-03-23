from django.db import models
from educationplatform.settings import AUTH_USER_MODEL
from tasks.models import TaskSubject
from users.models import Achievement


class TaskCollection(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.SlugField(max_length=100, blank=False, unique=True)

    subject = models.ForeignKey(TaskSubject, on_delete=models.PROTECT, blank=False, null=False)
    is_exam = models.BooleanField(blank=False, null=False, default=False)
    description = models.CharField(blank=True)
    is_public = models.BooleanField(default=False)
    tasks = models.ManyToManyField('tasks.Task', through='TaskCollectionTask', related_name='collections', blank=True)

    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False)
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Подборка задач"
        verbose_name_plural = "Подборки задач"


class TaskCollectionTask(models.Model):
    task_collection = models.ForeignKey(TaskCollection, on_delete=models.CASCADE, related_name='taskcollectiontasks')
    task = models.ForeignKey('tasks.Task', on_delete=models.CASCADE, related_name='taskcollectiontasks')
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('task_collection', 'task')
        ordering = ['order']
        verbose_name = "Связь задач и подборок"
        verbose_name_plural = "Связи задач и подборок"

    def __str__(self):
        return f"{self.task_collection.name} - {self.task.content[:15]} (Order: {self.order})"


class TaskCollectionSolve(models.Model):
    task_collection = models.ForeignKey('TaskCollection', on_delete=models.PROTECT, blank=False)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False)

    duration = models.IntegerField(blank=False)
    answers = models.JSONField(blank=False)
    score = models.IntegerField(blank=False)
    test_score = models.IntegerField(blank=True, null=True)
    achievements = models.ManyToManyField(Achievement, related_name='solves', blank=True)

    time_create = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Решение подборки задач"
        verbose_name_plural = "Решения подборок задач"
