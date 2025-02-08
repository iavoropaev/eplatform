import json

from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from courses.models import Course, Section, SectionSolve, Module, Lesson, CourseModule
from courses.serializers import CourseSerializer, SectionSolveSerializer, ModuleSerializer, LessonSerializer
from tasks.utils import check_answer


class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['all']:
            permission_classes = [AllowAny]
        elif self.action in ['data', 'send_solution', 'solved_sections', 'get_lesson', 'data']:
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
                ok_answer = {"type": section.task.answer_type, section.task.answer_type: json.loads(section.task.answer)}
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
