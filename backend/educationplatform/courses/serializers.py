from rest_framework import serializers

from courses.models import Course, Module, Lesson, Section, LessonSection, SectionSolve, CourseModule, ModuleLesson
from tasks.serializers import TaskSerializerForUser


class SectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionSolve
        fields = ('id', 'section', 'user', 'score', 'solve_status', 'answer')


class SectionSerializer(serializers.ModelSerializer):
    task = TaskSerializerForUser(read_only=True, many=False)

    class Meta:
        model = Section
        fields = ('id', 'type', 'task', 'content', 'video')


class LessonSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'name', 'sections')

    def get_sections(self, lesson):
        lesson_sections = getattr(lesson, 'prefetched_lessonsections', None)
        if not lesson_sections:
            lesson_sections = lesson.lessonsections.order_by('order')
        section = [ls.section for ls in lesson_sections]
        return SectionSerializer(section, many=True).data


class LessonOnlyNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'name')


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
        fields = ('id', 'name', 'description', 'modules')

    def get_modules(self, course):
        course_module = course.coursemodules.order_by('order')
        modules = [cm.module for cm in course_module]
        return ModuleSerializer(modules, many=True).data


class CourseInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'description')


class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'description', 'subject', 'created_by')


class ModuleAllFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'


class LessonAllFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class SectionAllFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'


# Links
class CourseModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModule
        fields = '__all__'


class ModuleLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuleLesson
        fields = '__all__'


class LessonSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonSection
        fields = '__all__'
