from django.contrib import admin

from courses.models import Course, Module, Lesson, Section, TheorySection, LessonSection

admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Section)
admin.site.register(TheorySection)
admin.site.register(LessonSection)

