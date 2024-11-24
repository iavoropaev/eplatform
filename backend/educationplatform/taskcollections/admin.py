from django.contrib import admin

from courses.models import SectionSolve
from taskcollections.models import TaskCollection, TaskCollectionSolve

admin.site.register(TaskCollection)
admin.site.register(TaskCollectionSolve)
admin.site.register(SectionSolve)
