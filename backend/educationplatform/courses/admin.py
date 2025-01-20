from django.contrib import admin

from courses.models import Course, Module, Lesson, Section,  LessonSection, CourseModule, ModuleLesson

admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Section)
admin.site.register(LessonSection)
admin.site.register(CourseModule)
admin.site.register(ModuleLesson)


