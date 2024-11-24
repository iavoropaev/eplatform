from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from courses.models import Course, Section, SectionSolve, Module, Lesson
from courses.serializers import CourseSerializer, SectionSolveSerializer


class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['all']:
            permission_classes = [AllowAny]
        elif self.action in ['data', 'send_solution', 'solved_sections']:
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
            if not Course.objects.all().filter(id=cur_course_id)[0].users.values().filter(id=cur_user_id).count():
                return Response({
                    'Error': 'У вас нет доступа к курсу.',
                }, status=403)

            course = Course.objects.all().filter(id=cur_course_id)[0]
            serializer = CourseSerializer(course, many=False)
            return Response({
                'course': serializer.data,
            })
        except:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @extend_schema(description='Send solution.')
    @action(detail=True, methods=['post'], url_path='send-solution')
    def send_solution(self, request, pk):
        try:
            cur_user_id = request.user.id
            cur_course_id = int(pk)
            cur_section_id = request.data['section_id']

            section = Section.objects.all().filter(id=cur_section_id)[0]
            solve = SectionSolve(user_id=cur_user_id, section_id=cur_section_id, score=0, solve_status=0)
            if section.type == 1:
                solve.solve_status = 1
            else:
                user_answer = request.data['user_answer']
                if str(user_answer) == str(section.task.answer):
                    solve.solve_status = 1
                    solve.score = 1
                else:
                    solve.solve_status = -1

            solve.save()
            serializer = SectionSolveSerializer(solve, many=False)

            return Response({
                'solve': serializer.data,
            })
        except:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @extend_schema(description='Get solved sections in course.')
    @action(detail=True, methods=['get'], url_path='solved-sections')
    def solved_sections(self, request, pk):
        try:
            cur_user_id = request.user.id
            cur_course_id = int(pk)

            solved_sections = []
            for module_id in Course.objects.all().filter(id=cur_course_id)[0].modules.values():
                for lesson_id in Module.objects.all().filter(id=module_id['id'])[0].lessons.values():
                    for section in Lesson.objects.all().filter(id=lesson_id['id'])[0].section.values():
                        if SectionSolve.objects.all().filter(section_id=section['id'], user_id=cur_user_id,
                                                             solve_status=1).count():
                            solved_sections.append(section['id'])

            return Response({
                'solved_sections_id': solved_sections,
            })
        except:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })
