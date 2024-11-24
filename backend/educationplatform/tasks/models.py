from django.db import models
from educationplatform.settings import AUTH_USER_MODEL


class Task(models.Model):
    content = models.CharField(blank=False)
    answer = models.CharField(blank=False)

    exam = models.ForeignKey('TaskExam', on_delete=models.PROTECT, blank=False)
    number_in_exam = models.ForeignKey('TaskNumberInExam', on_delete=models.PROTECT, blank=False)
    author = models.ForeignKey('Author', on_delete=models.PROTECT, blank=False)
    source = models.ForeignKey('TaskSource', on_delete=models.PROTECT, blank=False)
    topic = models.ForeignKey('TaskTopic', on_delete=models.PROTECT, blank=False)
    difficulty_level = models.ForeignKey('DifficultyLevel', on_delete=models.PROTECT, blank=False)
    is_available_in_bank = models.BooleanField(blank=False, default=True)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.id} {self.content[:10]}'


class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class TaskSource(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class DifficultyLevel(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class TaskTopic(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class TaskExam(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class TaskNumberInExam(models.Model):
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class TaskSolutions(models.Model):
    task = models.ForeignKey('Task', on_delete=models.PROTECT, blank=False)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False)
    answer = models.CharField(blank=False)
    is_ok_solution = models.BooleanField(blank=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.task_id} {self.user} {self.is_ok_solution}'


class UploadFiles(models.Model):
    file = models.FileField(upload_to='uploads')
