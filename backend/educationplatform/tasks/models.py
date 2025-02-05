from django.db import models
from educationplatform.settings import AUTH_USER_MODEL


# exam = models.ForeignKey('TaskExam', on_delete=models.PROTECT, blank=False)
class Task(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False)
    content = models.CharField(blank=False)

    answer_type = models.CharField(choices=[('text', 'text'), ('table', 'table'), ('choice', 'choice')])
    answer_data = models.JSONField(blank=True, null=True)
    answer = models.CharField(blank=False)

    number_in_exam = models.ForeignKey('TaskNumberInExam', on_delete=models.PROTECT, blank=True, null=True)

    author = models.ForeignKey('Author', on_delete=models.PROTECT, blank=True, null=True)
    source = models.ForeignKey('TaskSource', on_delete=models.PROTECT, blank=True, null=True)
    difficulty_level = models.ForeignKey('DifficultyLevel', on_delete=models.PROTECT, blank=True, null=True)
    actuality = models.ForeignKey('Actuality', on_delete=models.PROTECT, blank=True, null=True)

    bank_authors = models.ManyToManyField('TaskBankAuthor', related_name='tasks', blank=True)

    is_public = models.BooleanField(blank=False, default=True)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.id} {self.content[:10]}'


class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Actuality(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class TaskSource(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class DifficultyLevel(models.Model):
    name = models.CharField(max_length=100)
    exam = models.ForeignKey('TaskExam', on_delete=models.PROTECT, blank=False, related_name='dif_levels')
    def __str__(self):
        return self.name


class TaskTopic(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# class TaskExam(models.Model):
#     name = models.CharField(max_length=100)
#
#     def __str__(self):
#         return self.name


class TaskNumberInExam(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=False, null=False)

    subject = models.ForeignKey('TaskSubject', on_delete=models.PROTECT, blank=False, related_name='numbers')

    def __str__(self):
        return self.name


class TaskBankAuthor(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    subject = models.ForeignKey('TaskSubject', on_delete=models.PROTECT, blank=False, related_name='sources')

    def __str__(self):
        return self.name


class TaskSubject(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    exam = models.ForeignKey('TaskExam', on_delete=models.PROTECT, blank=False, related_name='subjects')
    authors = models.ManyToManyField('Author', related_name='subjects')
    difficulty_levels = models.ManyToManyField('DifficultyLevel', related_name='subjects')

    def __str__(self):
        return self.name


class TaskExam(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

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
