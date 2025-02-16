import json
import time

from rest_framework import status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.status import HTTP_200_OK

from courses.models import Course, Section, SectionSolve, Module, Lesson, CourseModule, ModuleLesson
from courses.serializers import CourseSerializer, SectionSolveSerializer, ModuleSerializer, LessonSerializer, \
    LessonOnlyNameSerializer, CourseModuleSerializer, ModuleAllFieldsSerializer, ModuleLessonSerializer, \
    LessonAllFieldsSerializer
from tasks.utils import check_answer


class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['all']:
            permission_classes = [AllowAny]
        elif self.action in ['data', 'send_solution', 'solved_sections', 'get_lesson',
                             'get_lesson_name', 'get_module_with_lessons']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @extend_schema(description='Get all courses names.')
    @action(detail=False, methods=['get'])
    def all(self, request):
        try:
            courses = Course.objects.all().values('id', 'name', 'slug', 'description')

            return Response({
                'courses': list(courses),
            })
        except:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @extend_schema(description='Get course.')
    @action(detail=True, methods=['get'])
    def data(self, request, pk):
        try:
            cur_user_id = request.user.id
            cur_course_id = int(pk)
            # if not Course.objects.all().filter(id=cur_course_id).first().users.values().filter(id=cur_user_id).count():
            #     return Response({
            #         'Error': 'У вас нет доступа к курсу.',
            #     }, status=403)

            course = Course.objects.all().filter(id=cur_course_id)[0]
            course_serializer = CourseSerializer(course, many=False)
            return Response(course_serializer.data)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @extend_schema(description='Get lesson by Id.')
    @action(detail=False, methods=['get'], url_path='get-lesson')
    def get_lesson(self, request):
        try:
            cur_user_id = request.user.id
            cur_lesson_id = request.GET.get('lesson_id')
            lesson = Lesson.objects.all().filter(id=cur_lesson_id)[0]
            lesson_serializer = LessonSerializer(lesson, many=False)
            section_ids = [section['id'] for section in lesson_serializer.data['sections']]

            solves = (SectionSolve.objects.all().filter(user=cur_user_id, section__in=section_ids)
                      .order_by('section', '-score', '-time_create').distinct('section'))
            solve_serializer = SectionSolveSerializer(solves, many=True)

            lesson_data = lesson_serializer.data
            section_solve_dict = {solve['section']: solve for solve in solve_serializer.data}
            for section in lesson_data['sections']:
                if section['id'] in section_solve_dict:
                    section['solve'] = section_solve_dict[section['id']]
                else:
                    section['solve'] = None

            return Response(lesson_data)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

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
            print(e)
            return Response({
                'Error': 'Не удалось обработать запрос.'}, status=404)

    @action(detail=False, methods=['get'], url_path='get-module-with-lessons')
    def get_module_with_lessons(self, request):
        try:
            cur_module_id = request.GET.get('module_id')
            print(cur_module_id)
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
            score = 0
            if section.type == 'text':
                solve_status = 1
                score = 1
            else:
                ok_answer = {"type": section.task.answer_type,
                             section.task.answer_type: json.loads(section.task.answer)}
                if check_answer(user_answer, ok_answer):
                    solve_status = 1
                    score = 1
                else:
                    solve_status = -1

            solve = SectionSolve(user_id=cur_user_id, section_id=cur_section_id,
                                 score=score, solve_status=solve_status, answer=user_answer)
            solve.save()
            serializer = SectionSolveSerializer(solve, many=False)

            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })


class EditCourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['update_course', 'create_module']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

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
                return Response({"detail": "У вас нет прав на редактирование этой подборки."},
                                status=status.HTTP_403_FORBIDDEN)

            # Course info update
            course_info = {}
            if 'name' in request.data:
                course_info['name'] = request.data['name']
            if 'description' in request.data:
                course_info['description'] = request.data['description']
            serializer = CourseSerializer(course, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Modules info update
            for module in request.data['modules']:
                module_obj = Module.objects.all().get(id=module['id'])
                if (cur_user_id == module_obj.created_by.id) or (is_admin):
                    module_data = {'name':module['name']}
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
            print(e)
            course = Course.objects.all().get(id=course_id)
            course_serializer = CourseSerializer(course, many=False)
            return Response(course_serializer.data)

    @action(detail=False, methods=['post'], url_path='create-module')
    def create_module(self, request):
        try:
            cur_user_id = request.user.id
            data = request.data | {'created_by': cur_user_id}
            print(data)
            serializer = ModuleAllFieldsSerializer(data=data)
            if serializer.is_valid():
                new_module = serializer.save()
                serializer_with_lessons = ModuleSerializer(new_module)
                return Response(serializer_with_lessons.data, status=status.HTTP_201_CREATED)
            return Response({'Error': 'Не удалось создать модуль.'}, status=status.HTTP_417_EXPECTATION_FAILED)
        except Exception as e:
            print(e)
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
                return Response(only_name_serializer.data, status=status.HTTP_201_CREATED)
            return Response({'Error': 'Не удалось создать модуль.'}, status=status.HTTP_417_EXPECTATION_FAILED)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось создать модуль.',
            }, status=status.HTTP_417_EXPECTATION_FAILED)

    # @extend_schema(description='Get solved sections in course.')
    # @action(detail=True, methods=['get'], url_path='solved-sections')
    # def solved_sections(self, request, pk):
    #     try:
    #         cur_user_id = request.user.id
    #         cur_course_id = int(pk)
    #
    #         solved_sections = []
    #         for module_id in Course.objects.all().filter(id=cur_course_id)[0].modules.values():
    #             for lesson_id in Module.objects.all().filter(id=module_id['id'])[0].lessons.values():
    #                 for section in Lesson.objects.all().filter(id=lesson_id['id'])[0].section.values():
    #                     if SectionSolve.objects.all().filter(section_id=section['id'], user_id=cur_user_id,
    #                                                          solve_status=1).count():
    #                         solved_sections.append(section['id'])
    #
    #         return Response({
    #             'solved_sections_id': solved_sections,
    #         })
    #     except:
    #         return Response({
    #             'Error': 'Не удалось обработать запрос.',
    #         })
