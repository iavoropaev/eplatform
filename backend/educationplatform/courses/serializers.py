from rest_framework import serializers

from courses.models import Course, Module, Lesson, Section, LessonSection,  SectionSolve
from tasks.serializers import  TaskSerializerForUser


class SectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionSolve
        fields = ('id', 'section', 'user', 'score', 'solve_status', 'answer')


class SectionSerializer(serializers.ModelSerializer):
    task = TaskSerializerForUser(read_only=True, many=False)

    class Meta:
        model = Section
        fields = ('id', 'name', 'task', 'content', 'video')



class LessonSectionSerializer(serializers.ModelSerializer):
    section = SectionSerializer(read_only=True, many=False)

    class Meta:
        model = LessonSection
        fields = ('id', 'section', 'order')
        depth = 2


class LessonSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'name', 'sections')

    def get_sections(self, lesson):
        lesson_sections = lesson.lessonsections.order_by('order')
        section = [ls.section for ls in lesson_sections]
        return SectionSerializer(section, many=True).data


class ModuleSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()
    class Meta:
        model = Module
        fields = ('id', 'name', 'lessons')
        ordering = ['order']

    def get_lessons(self, module):
        module_lessons = module.modulelessons.order_by('order')
        lessons = [ml.lesson for ml in module_lessons]
        return LessonSerializer(lessons, many=True).data


class CourseSerializer(serializers.ModelSerializer):
    modules = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = ('id', 'name', 'slug', 'description', 'modules')

    def get_modules(self, course):
        course_module = course.coursemodules.order_by('order')
        modules = [cm.module for cm in course_module]
        return ModuleSerializer(modules, many=True).data

