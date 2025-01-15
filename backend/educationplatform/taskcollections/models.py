from django.db import models
from educationplatform.settings import AUTH_USER_MODEL

class TaskCollection(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.SlugField(max_length=100, blank=False, unique=True)
    description = models.CharField(blank=True)
    is_public = models.BooleanField(default=False)
    tasks = models.ManyToManyField('tasks.Task', through='TaskCollectionTask', related_name='collections', blank=True)

    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False)
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class TaskCollectionTask(models.Model):
    task_collection = models.ForeignKey(TaskCollection, on_delete=models.CASCADE)
    task = models.ForeignKey('tasks.Task', on_delete=models.CASCADE, related_name='taskcollectiontasks')
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('task_collection', 'task')
        ordering = ['order']

    def __str__(self):
        return f"{self.task_collection.name} - {self.task.title} (Order: {self.order})"


class TaskCollectionSolve(models.Model):
    task_collection = models.ForeignKey('TaskCollection', on_delete=models.PROTECT, blank=False)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False)

    answers = models.JSONField(blank=False)
    score = models.IntegerField(blank=False)
    duration = models.IntegerField(blank=False)

    time_create = models.DateTimeField(auto_now_add=True)
    # answers -> [{task_id:1, score:2, status:'ok',
    # user_answer:{type:'text', data:'1234'},
    # ok_answer: {type: 'text', data: '1234'},
    # }]
    # All answers. Include empty.