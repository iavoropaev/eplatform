from django.contrib import admin

from .models import Task, TaskSource, DifficultyLevel, TaskTopic, TaskSolutions, TaskExam, TaskNumberInExam, \
    TaskSubject, TaskBankAuthor, Actuality, TaskAuthor, UploadFiles

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
admin.site.register(UploadFiles)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_by__last_name', 'is_public', 'time_create')
    list_select_related = ('created_by', 'number_in_exam', 'author', 'source', 'difficulty_level', 'actuality')
    search_fields = ['id', 'content']
    list_per_page = 25
