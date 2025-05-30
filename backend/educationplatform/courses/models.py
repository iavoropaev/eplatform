from django.db import models
from educationplatform.settings import AUTH_USER_MODEL
from tasks.models import TaskSubject


class Course(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False,
                                   related_name='created_courses')
    name = models.CharField(max_length=100, blank=False)
    description = models.CharField(blank=True)
    subject = models.ForeignKey(TaskSubject, on_delete=models.PROTECT, blank=False, null=False)
    is_public = models.BooleanField(default=False)

    modules = models.ManyToManyField('Module', through='CourseModule', blank=True, related_name='courses')

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"


class Module(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False,
                                   related_name='created_modules')
    name = models.CharField(max_length=100, blank=False)
    description = models.CharField(blank=True)
    lessons = models.ManyToManyField('courses.Lesson', through='ModuleLesson', related_name='modules', blank=True)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Модуль"
        verbose_name_plural = "Модули"


class Lesson(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False,
                                   related_name='created_lessons')
    name = models.CharField(max_length=100, blank=False)

    section = models.ManyToManyField('Section', blank=True, through='LessonSection', related_name='lessons')

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Урок"
        verbose_name_plural = "Уроки"


class Section(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False,
                                   related_name='created_sections')
    type = models.CharField(choices=[('task', 'task'), ('text', 'text')])

    task = models.ForeignKey('tasks.Task', on_delete=models.PROTECT, blank=True, null=True)
    content = models.CharField(blank=True)
    video = models.CharField(blank=True, max_length=1000)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content[:20]

    class Meta:
        verbose_name = "Секция"
        verbose_name_plural = "Секции"


class SectionSolve(models.Model):
    section = models.ForeignKey('Section', on_delete=models.PROTECT, blank=False, null=False)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False)

    answer = models.JSONField()
    score = models.IntegerField(blank=False, null=False)
    solve_status = models.CharField(blank=False, choices=[('WA', 'WA'), ('OK', 'OK'), ('PA', 'PA'), ('NA', 'NA')])

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Решение секции"
        verbose_name_plural = "Решения секций"


# Connections
class LessonSection(models.Model):
    lesson = models.ForeignKey('Lesson', on_delete=models.PROTECT, related_name='lessonsections')
    section = models.ForeignKey('Section', on_delete=models.PROTECT, related_name='lessonsections')

    order = models.IntegerField(blank=False, null=False)

    class Meta:
        unique_together = ('lesson', 'section')
        ordering = ['order']
        verbose_name = "Связь уроков и секций"
        verbose_name_plural = "Связи уроков и секций"

    def __str__(self):
        return f"{self.lesson.name} - {self.section.content} (Order: {self.order})"


class CourseModule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='coursemodules')
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='coursemodules')
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('course', 'module')
        ordering = ['order']
        verbose_name = "Связь курса и урока"
        verbose_name_plural = "Связи курсов и уроков"

    def __str__(self):
        return f"{self.course.name} - {self.module.name} (Order: {self.order})"


class ModuleLesson(models.Model):
    module = models.ForeignKey('courses.Module', on_delete=models.CASCADE, related_name='modulelessons')
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE, related_name='modulelessons')
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('module', 'lesson')
        ordering = ['order']
        verbose_name = "Связь модуля и урока"
        verbose_name_plural = "Связи модулей и уроков"

    def __str__(self):
        return f"{self.module.name} - {self.lesson.name} (Order: {self.order})"
