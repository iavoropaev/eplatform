from rest_framework import serializers

from courses.models import Course, Module, Lesson, Section, LessonSection, TheorySection, SectionSolve
from tasks.models import Task


class SectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionSolve
        fields = ('id', 'section', 'user', 'score', 'solve_status')


class TheorySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TheorySection
        fields = ('id', 'name', 'slug', 'description', 'content')


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'content', 'author', 'source', 'topic', 'difficulty_level')


class SectionSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True, many=False)
    theory_section = TheorySectionSerializer(read_only=True, many=False)

    class Meta:
        model = Section
        fields = ('id', 'name', 'task', 'theory_section')
        depth = 1


class LessonSectionSerializer(serializers.ModelSerializer):
    section = SectionSerializer(read_only=True, many=False)

    class Meta:
        model = LessonSection
        fields = ('id', 'section', 'position')
        depth = 2


class LessonSerializer(serializers.ModelSerializer):
    lessonsection_set = LessonSectionSerializer(read_only=True, many=True)

    class Meta:
        model = Lesson
        fields = ('id', 'name', 'lessonsection_set')


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(read_only=True, many=True)

    class Meta:
        model = Module
        fields = ('id', 'name', 'lessons')


class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(read_only=True, many=True)

    class Meta:
        model = Course
        fields = ('id', 'name', 'slug', 'description', 'modules')
        # depth = 3
