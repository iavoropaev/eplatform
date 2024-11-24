from django.db import models
from educationplatform.settings import AUTH_USER_MODEL


class Course(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.CharField(max_length=100, blank=False, unique=True)
    description = models.CharField(blank=True)

    users = models.ManyToManyField(AUTH_USER_MODEL, blank=True)
    modules = models.ManyToManyField('Module', blank=True, related_name='courses')

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Module(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.CharField(max_length=100, blank=False, unique=True)
    description = models.CharField(blank=True)

    lessons = models.ManyToManyField('Lesson', blank=True)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Lesson(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.CharField(max_length=100, blank=False, unique=True)
    description = models.CharField(blank=True)

    section = models.ManyToManyField('Section', blank=True, through='LessonSection', related_name='lessons')

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class LessonSection(models.Model):
    lesson = models.ForeignKey('Lesson', on_delete=models.PROTECT)
    section = models.ForeignKey('Section', on_delete=models.PROTECT)

    position = models.IntegerField(blank=False, null=False)


class Section(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.CharField(max_length=100, blank=False, unique=True)
    description = models.CharField(blank=True)

    type = models.IntegerField(blank=False)
    task = models.ForeignKey('tasks.Task', on_delete=models.PROTECT, blank=True, null=True)
    theory_section = models.ForeignKey('TheorySection', on_delete=models.PROTECT, blank=True, null=True)
    video = models.CharField(blank=True)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class TheorySection(models.Model):
    name = models.CharField(max_length=100, blank=False)
    slug = models.CharField(max_length=100, blank=False, unique=True)
    description = models.CharField(blank=True)

    content = models.CharField()

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class SectionSolve(models.Model):
    section = models.ForeignKey('Section', on_delete=models.PROTECT, blank=False, null=False)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False)

    score = models.IntegerField(blank=False, null=False)
    solve_status = models.IntegerField(blank=False, null=False)