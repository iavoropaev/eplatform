from django.db import models
from educationplatform.settings import AUTH_USER_MODEL


class TaskCollection(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.CharField(max_length=100, blank=False, unique=True)
    description = models.CharField(blank=True)

    tasks = models.ManyToManyField('tasks.Task', blank=True, related_name='tasks')

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class TaskCollectionSolve(models.Model):
    task_collection = models.ForeignKey('TaskCollection', on_delete=models.PROTECT, blank=False)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False)

    answers = models.CharField(blank=False)
    score = models.IntegerField(blank=False)
    duration = models.IntegerField(blank=False)

    time_create = models.DateTimeField(auto_now_add=True)
