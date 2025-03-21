from django.contrib import admin

from .models import Task, TaskSource, DifficultyLevel, TaskTopic, TaskSolutions, TaskExam, TaskNumberInExam, \
    TaskSubject, TaskBankAuthor, Actuality, TaskAuthor

admin.site.register(Task)
admin.site.register(TaskAuthor)
admin.site.register(TaskSource)
admin.site.register(DifficultyLevel)
admin.site.register(TaskTopic)
admin.site.register(TaskExam)
admin.site.register(TaskNumberInExam)
admin.site.register(TaskSubject)
admin.site.register(TaskBankAuthor)
admin.site.register(Actuality)
admin.site.register(TaskSolutions)