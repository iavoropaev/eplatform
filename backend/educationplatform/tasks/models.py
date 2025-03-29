from django.db import models
from educationplatform.settings import AUTH_USER_MODEL


class Task(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=False)
    content = models.CharField(blank=False)

    answer_type = models.CharField(choices=[('text', 'text'), ('table', 'table'),
                                            ('comparison', 'comparison'), ('sorting', 'sorting'),
                                            ('choice', 'choice'), ('open_answer', 'open_answer')])
    answer_data = models.JSONField(blank=True, null=True)
    answer = models.CharField(blank=False)

    number_in_exam = models.ForeignKey('TaskNumberInExam', on_delete=models.PROTECT, blank=True, null=True)

    author = models.ForeignKey('TaskAuthor', on_delete=models.PROTECT, blank=True, null=True)
    source = models.ForeignKey('TaskSource', on_delete=models.PROTECT, blank=True, null=True)
    difficulty_level = models.ForeignKey('DifficultyLevel', on_delete=models.PROTECT, blank=True, null=True)
    actuality = models.ForeignKey('Actuality', on_delete=models.PROTECT, blank=True, null=True)

    files = models.ManyToManyField('UploadFiles', related_name='tasks', blank=True)
    bank_authors = models.ManyToManyField('TaskBankAuthor', related_name='tasks', blank=True)

    is_public = models.BooleanField(blank=False, default=True)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.id} | {self.created_by.last_name} | {self.content[:10]}'

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"


class TaskAuthor(models.Model):
    name = models.CharField(max_length=100)
    link = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Автор задачи"
        verbose_name_plural = "Авторы задач"


class Actuality(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Актуальность задачи"
        verbose_name_plural = "Актуальности задач"


class TaskSource(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Источник задачи"
        verbose_name_plural = "Источники задач"


class DifficultyLevel(models.Model):
    name = models.CharField(max_length=100)
    exam = models.ForeignKey('TaskExam', on_delete=models.PROTECT, blank=False, related_name='dif_levels')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Сложность задач"
        verbose_name_plural = "Сложности задач"


class TaskTopic(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Тема задачи"
        verbose_name_plural = "Темы задач"


class TaskNumberInExam(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=False, null=False)

    check_rule = models.CharField(max_length=100, default='default')
    max_score = models.IntegerField(blank=False, null=False, default=1)
    subject = models.ForeignKey('TaskSubject', on_delete=models.PROTECT, blank=False, related_name='numbers')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Номер задач в экзамене"
        verbose_name_plural = "Номера задач в экзамене"


class TaskBankAuthor(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    subject = models.ForeignKey('TaskSubject', on_delete=models.PROTECT, blank=False, related_name='sources')

    def __str__(self):
        return f'{self.name} - {self.subject.name} - {self.subject.exam.name}'

    class Meta:
        verbose_name = "Автор банка задач"
        verbose_name_plural = "Авторы банка задач"


class TaskSubject(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    exam = models.ForeignKey('TaskExam', on_delete=models.PROTECT, blank=False, related_name='subjects')
    authors = models.ManyToManyField('TaskAuthor', related_name='subjects')
    difficulty_levels = models.ManyToManyField('DifficultyLevel', related_name='subjects')

    scale = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Предмет"
        verbose_name_plural = "Предметы"


class TaskExam(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Экзамен"
        verbose_name_plural = "Экзамены"


class TaskSolutions(models.Model):
    task = models.ForeignKey('Task', on_delete=models.PROTECT, blank=False)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False)
    answer = models.CharField(blank=False)
    score = models.IntegerField(blank=False, null=False, default=0)
    is_ok_solution = models.BooleanField(blank=False)
    status = models.CharField(blank=False, choices=[('WA', 'WA'), ('OK', 'OK'), ('PA', 'PA'), ('NA', 'NA')])
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.task_id} {self.user} {self.is_ok_solution}'

    class Meta:
        verbose_name = "Решение задачи"
        verbose_name_plural = "Решения задач"


class UploadFiles(models.Model):
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.PROTECT, blank=False, null=True)
    file = models.FileField(upload_to='uploads')
    name = models.CharField(max_length=1023, default='file')
    location = models.CharField(max_length=1023, blank=False, null=False)

    class Meta:
        verbose_name = "Файл"
        verbose_name_plural = "Файлы"
