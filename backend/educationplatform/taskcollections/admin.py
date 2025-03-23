from django.contrib import admin

from courses.models import SectionSolve
from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask

admin.site.register(TaskCollection)
admin.site.register(TaskCollectionSolve)
admin.site.register(SectionSolve)
admin.site.register(TaskCollectionTask)
