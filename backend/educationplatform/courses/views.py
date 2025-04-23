import json

from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND

from courses.models import Course, Section, SectionSolve, Module, Lesson, CourseModule, ModuleLesson, LessonSection
from courses.serializers import CourseSerializer, SectionSolveSerializer, ModuleSerializer, LessonSerializer, \
    LessonOnlyNameSerializer, CourseModuleSerializer, ModuleAllFieldsSerializer, ModuleLessonSerializer, \
    LessonAllFieldsSerializer, SectionAllFieldsSerializer, LessonSectionSerializer, SectionSerializer, \
    CourseCreateSerializer, CourseInfoSerializer
from courses.utils import get_lesson_data_with_solves, create_empty_section
from tasks.utils import check_answer


class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['all', 'get_courses_by_subject']:
            permission_classes = [AllowAny]
        elif self.action in ['data', 'send_solution', 'solved_sections', 'get_lesson',
                             'get_lesson_name', 'get_module_with_lessons', 'get_section', 'my_courses']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @extend_schema(description='Get all courses names.')
    @action(detail=False, methods=['get'])
    def all(self, request):
        try:
            courses = Course.objects.all().values('id', 'name', 'description')

            return Response({
                'courses': list(courses),
            })
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            }, status=400)

    @action(detail=False, methods=['get'], url_path='my-courses')
    def my_courses(self, request):
        cur_user_id = request.user.id
        courses = Course.objects.all().filter(created_by=cur_user_id).values('id', 'name', 'description')
        return Response(courses, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='get-courses-by-subject')
    def get_courses_by_subject(self, request):
        subject_slug = request.query_params.get('subject_slug', None)
        queryset = Course.objects.filter(is_public=True, subject__slug=subject_slug)
        serializer = CourseInfoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(description='Get course.')
    @action(detail=True, methods=['get'])
    def data(self, request, pk):
        try:
            cur_user_id = request.user.id
            cur_course_id = int(pk)
            course = Course.objects.filter(id=cur_course_id).get()

            course_serializer = CourseSerializer(course, many=False)
            data = course_serializer.data
            data['is_author'] = cur_user_id == course.created_by.id
            return Response(data)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            }, status=400)

    @extend_schema(description='Get lesson by Id.')
    @action(detail=False, methods=['get'], url_path='get-lesson')
    def get_lesson(self, request):
        try:
            cur_user_id = request.user.id
            cur_lesson_id = request.GET.get('lesson_id')
            lesson_data = get_lesson_data_with_solves(cur_lesson_id, cur_user_id)
            return Response(lesson_data)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            }, status=400)

    @action(detail=False, methods=['get'], url_path='get-section')
    def get_section(self, request):
        try:
            cur_user_id = request.user.id
            cur_section_id = request.GET.get('section_id')
            section = Section.objects.all().get(id=cur_section_id)
            serializer = SectionSerializer(section)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            }, status=HTTP_404_NOT_FOUND)

    @extend_schema(description='Get lesson name by Id.')
    @action(detail=False, methods=['get'], url_path='get-lesson-name')
    def get_lesson_name(self, request):
        try:
            cur_lesson_id = request.GET.get('lesson_id')
            lesson = Lesson.objects.all().filter(id=cur_lesson_id)[0]
            lesson_serializer = LessonOnlyNameSerializer(lesson, many=False)
            lesson_data = lesson_serializer.data
            return Response(lesson_data)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.'}, status=404)

    @action(detail=False, methods=['get'], url_path='get-module-with-lessons')
    def get_module_with_lessons(self, request):
        try:
            cur_module_id = request.GET.get('module_id')
            module = Module.objects.all().get(id=cur_module_id)
            serializer = ModuleSerializer(module, many=False)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({'Error': 'Не удалось обработать запрос.'}, status=404)

    @extend_schema(description='Send solution.')
    @action(detail=False, methods=['post'], url_path='send-solution')
    def send_solution(self, request):
        try:
            cur_user_id = request.user.id
            cur_section_id = request.data['section_id']
            user_answer = request.data['user_answer']

            section = Section.objects.all().filter(id=cur_section_id)[0]

            if section.type == 'text':
                solve_status = 'OK'
                score = 1
            else:
                ok_answer = {"type": section.task.answer_type,
                             section.task.answer_type: json.loads(section.task.answer)}
                check_res = check_answer(user_answer,
                                         ok_answer,
                                         max_score=getattr(section.task.number_in_exam, 'max_score', None),
                                         check_rule=getattr(section.task.number_in_exam, 'check_rule', None)
                                         )
                solve_status = check_res['status']
                score = check_res['score']

            solve = SectionSolve(user_id=cur_user_id,
                                 section_id=cur_section_id,
                                 score=score,
                                 solve_status=solve_status,
                                 answer=user_answer
                                 )
            solve.save()
            serializer = SectionSolveSerializer(solve, many=False)

            return Response(serializer.data)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            }, status=400)


class EditCourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['create_course', 'update_course', 'update_lesson', 'create_module', 'create_lesson',
                           'create_section', 'delete_course']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'], url_path='create-course')
    def create_course(self, request):
        try:
            cur_user_id = request.user.id
            data = request.data | {'created_by': cur_user_id}
            serializer = CourseCreateSerializer(data=data)
            if serializer.is_valid():
                new_course = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'Error': 'Не удалось создать курс.'}, status=status.HTTP_417_EXPECTATION_FAILED)
        except Exception as e:

            return Response({
                'Error': 'Не удалось создать курс.',
            }, status=status.HTTP_417_EXPECTATION_FAILED)

    @action(detail=False, methods=['post'], url_path='create-module')
    def create_module(self, request):
        try:
            cur_user_id = request.user.id
            data = request.data | {'created_by': cur_user_id}

            serializer = ModuleAllFieldsSerializer(data=data)
            if serializer.is_valid():
                new_module = serializer.save()
                serializer_with_lessons = ModuleSerializer(new_module)
                return Response(serializer_with_lessons.data, status=status.HTTP_201_CREATED)
            return Response({'Error': 'Не удалось создать модуль.'}, status=status.HTTP_417_EXPECTATION_FAILED)
        except Exception as e:

            return Response({
                'Error': 'Не удалось создать модуль.',
            }, status=status.HTTP_417_EXPECTATION_FAILED)

    @action(detail=False, methods=['post'], url_path='create-lesson')
    def create_lesson(self, request):
        try:
            cur_user_id = request.user.id
            data = request.data | {'created_by': cur_user_id}
            serializer = LessonAllFieldsSerializer(data=data)
            if serializer.is_valid():
                new_lesson = serializer.save()
                only_name_serializer = LessonOnlyNameSerializer(new_lesson)
                first_section = create_empty_section(cur_user_id)
                s_l_data = {'lesson': new_lesson.id, 'section': first_section.id, 'order': 0}
                lesson_section_serializer = LessonSectionSerializer(data=s_l_data)
                if lesson_section_serializer.is_valid():
                    lesson_section_serializer.save()
                return Response(only_name_serializer.data, status=status.HTTP_201_CREATED)
            return Response({'Error': 'Не удалось создать модуль.'}, status=status.HTTP_417_EXPECTATION_FAILED)
        except Exception as e:
            return Response({
                'Error': 'Не удалось создать модуль.',
            }, status=status.HTTP_417_EXPECTATION_FAILED)

    @action(detail=False, methods=['post'], url_path='create-section')
    def create_section(self, request):
        try:
            cur_user_id = request.user.id
            created_section = create_empty_section(cur_user_id)
            serializer = SectionSerializer(created_section)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'Error': 'Не удалось создать секцию.',
            }, status=status.HTTP_417_EXPECTATION_FAILED)

    @action(detail=False, methods=['post'], url_path='update-lesson')
    def update_lesson(self, request):
        try:
            cur_user_id = request.user.id
            is_admin = request.user.is_staff

            if 'id' in request.data:
                lesson_id = request.data['id']
                lesson = Lesson.objects.get(id=lesson_id)
            else:
                return Response({"detail": "Урок не найден."},
                                status=status.HTTP_404_NOT_FOUND)

            if (cur_user_id != lesson.created_by.id) and (request.user.is_staff == False):
                return Response({"detail": "У вас нет прав на редактирование этого урока."},
                                status=status.HTTP_403_FORBIDDEN)

            # Lesson info update
            course_info = {}
            if 'name' in request.data:
                course_info['name'] = request.data['name']
            serializer = LessonOnlyNameSerializer(lesson, data=course_info, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Sections info update
            for section in request.data['sections']:
                section_obj = Section.objects.all().get(id=section['id'])
                if (cur_user_id == section_obj.created_by.id) or (is_admin):
                    section_data = {'content': section['content'], 'task': section['task'], 'type': section['type']}

                    section_serializer = SectionAllFieldsSerializer(section_obj, data=section_data, partial=True)
                    if section_serializer.is_valid():
                        section_serializer.save()

            # Lesson-section update
            sections_links_to_delete_saved = list(LessonSection.objects.filter(lesson=lesson_id).values())
            sections_links_to_delete = LessonSection.objects.filter(lesson=lesson_id)
            data = []
            for i, section in enumerate(request.data['sections']):
                data.append({'lesson': lesson_id, 'section': section['id'], 'order': i})
            sections_links_to_delete.delete()
            serializer = LessonSectionSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
            else:
                LessonSection.objects.bulk_create([LessonSection(**data) for data in sections_links_to_delete_saved])

            lesson_data = get_lesson_data_with_solves(lesson_id, cur_user_id)
            return Response(lesson_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            lesson_data = get_lesson_data_with_solves(lesson_id, cur_user_id)
            return Response(lesson_data)

    @action(detail=False, methods=['post'], url_path='update')
    def update_course(self, request):
        try:
            cur_user_id = request.user.id
            is_admin = request.user.is_staff

            if 'id' in request.data:
                course_id = request.data['id']
                course = Course.objects.get(id=course_id)
            else:
                return Response({"detail": "Курс не найден."},
                                status=status.HTTP_404_NOT_FOUND)

            if (cur_user_id != course.created_by.id) and (request.user.is_staff == False):
                return Response({"detail": "У вас нет прав на редактирование этого курса."},
                                status=status.HTTP_403_FORBIDDEN)

            # Course info update
            course_info = {}
            if 'name' in request.data:
                course_info['name'] = request.data['name']
            if 'description' in request.data:
                course_info['description'] = request.data['description']
            serializer = CourseSerializer(course, data=course_info, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Modules info update
            for module in request.data['modules']:
                module_obj = Module.objects.all().get(id=module['id'])
                if (cur_user_id == module_obj.created_by.id) or (is_admin):
                    module_data = {'name': module['name']}
                    module_serializer = ModuleAllFieldsSerializer(module_obj, data=module_data, partial=True)
                    if module_serializer.is_valid():
                        module_serializer.save()

            # Course-modules update
            modules_links_to_delete_saved = list(CourseModule.objects.filter(course=course).values())
            modules_links_to_delete = CourseModule.objects.filter(course=course)
            data = []
            for i, module in enumerate(request.data['modules']):
                data.append({'course': course_id, 'module': module['id'], 'order': i})
            modules_links_to_delete.delete()
            serializer = CourseModuleSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
            else:
                CourseModule.objects.bulk_create([CourseModule(**data) for data in modules_links_to_delete_saved])

            # Modules-lessons  update
            for module in request.data['modules']:
                module_obj = Module.objects.all().get(id=module['id'])
                if (cur_user_id == module_obj.created_by.id) or (is_admin):
                    lessons_links_to_delete_saved = list(ModuleLesson.objects.filter(module=module['id']).values())
                    lessons_links_to_delete = ModuleLesson.objects.filter(module=module['id'])
                    data = []
                    for i, lesson in enumerate(module['lessons']):
                        data.append({'module': module['id'], 'lesson': lesson['id'], 'order': i})
                    lessons_links_to_delete.delete()
                    serializer = ModuleLessonSerializer(data=data, many=True)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        ModuleLesson.objects.bulk_create(
                            [CourseModule(**data) for data in lessons_links_to_delete_saved])

            course = Course.objects.all().get(id=course_id)
            course_serializer = CourseSerializer(course, many=False)
            return Response(course_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            course = Course.objects.all().get(id=course_id)
            course_serializer = CourseSerializer(course, many=False)
            return Response(course_serializer.data)

    @action(detail=False, methods=['post'], url_path='delete-course')
    def delete_course(self, request):
        try:
            cur_user_id = request.user.id
            course_id = request.data['course_id']
            cur_course = Course.objects.filter(id=course_id).get()
            if cur_course.created_by.id != cur_user_id:
                return Response(status=406)
            cur_course.delete()
            return Response("deleted")
        except Exception as e:
            return Response(status=400)
