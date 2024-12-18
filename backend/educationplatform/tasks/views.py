import datetime
import json

import pytz
from django.db.models import Count, Q
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse, inline_serializer

from rest_framework import viewsets, serializers, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response

from educationplatform.settings import DOMEN
from .models import Task, UploadFiles, Author, TaskSource, DifficultyLevel, TaskTopic, TaskSolutions, TaskNumberInExam, \
    TaskExam
from .serializers import TaskSerializer, TaskSerializerForUser, TaskSolutionsSerializer, FilterSerializer, \
    TaskNumberInExamSerializer, TaskSerializerForCreate
from .utils import check_answer


class TaskViewSet(viewsets.ModelViewSet):
    '''CRUD operations with tasks.'''

    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return TaskSerializerForCreate
        return TaskSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'filtered', 'new_tasks']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @extend_schema(description='''Get tasks filtered by authors, sources, topics, create time. Ordering by create time. 
    Params: authors, sources, topics, d_levels, period(day, week, month).''')
    @action(detail=False, methods=['post'])
    def filtered(self, request):
        tasks = Task.objects.all()
        if 'subject' in request.data:
            tasks = tasks.filter(number_in_exam__subject__id=request.data['subject'])

        if 'bank_authors' in request.data and request.data['bank_authors']:
            tasks = tasks.filter(bank_authors__id__in=request.data['bank_authors'])
        if 'numbers_in_exam' in request.data and request.data['numbers_in_exam']:
            tasks = tasks.filter(number_in_exam_id__in=request.data['numbers_in_exam'])
        if 'authors' in request.data and request.data['authors']:
            tasks = tasks.filter(author_id__in=request.data['authors'])
        if 'sources' in request.data and request.data['sources']:
            tasks = tasks.filter(source_id__in=request.data['sources'])
        if 'topics' in request.data and request.data['topics']:
            tasks = tasks.filter(topic_id__in=request.data['topics'])
        if 'd_levels' in request.data and request.data['d_levels']:
            tasks = tasks.filter(difficulty_level_id__in=request.data['d_levels'])

        if 'period' in request.data:
            period = request.data['period']
            cur_time = datetime.datetime.now(pytz.timezone('Europe/Moscow'))
            if period == 'day':
                tasks = tasks.filter(time_create__date=cur_time)
            elif period == 'week':
                tasks = tasks.filter(time_create__range=(cur_time - datetime.timedelta(days=7), cur_time))
            elif period == 'month':
                tasks = tasks.filter(time_create__range=(cur_time - datetime.timedelta(days=31), cur_time))
            else:
                return Response({'Error': 'Неверно указан период.'}, status=406)

        if 'ordering' in request.data:
            ordering = request.data['ordering']
            if ordering == 'new-first':
                tasks = tasks.order_by('-time_create')
            elif ordering == 'old-first':
                tasks = tasks.order_by('time_create')
            else:
                return Response({'Error': 'Неверно указан критерий сортировки.'}, status=406)
        serializer = TaskSerializerForUser(tasks, many=True)
        data = serializer.data
        return Response({'count': len(data), 'tasks': data})

    @extend_schema(description='Get new tasks. Available periods: day, week, month.')
    @action(detail=False, methods=['get'], url_path='new')
    def new_tasks(self, request):
        try:
            cur_time = datetime.datetime.now(pytz.timezone('Europe/Moscow'))
            tasks = Task.objects.all().filter(is_available_in_bank=True)

            period = request.data['period']

            if period == 'day':
                tasks = tasks.filter(time_create__date=cur_time)
            elif period == 'week':
                tasks = tasks.filter(time_create__range=(cur_time - datetime.timedelta(days=7), cur_time))
            elif period == 'month':
                tasks = tasks.filter(time_create__range=(cur_time - datetime.timedelta(days=31), cur_time))
            else:
                return Response({'Error': 'Неверно указан период.'}, status=406)

            tasks = tasks.order_by('-time_create')

            serializer = TaskSerializerForUser(tasks, many=True)
            data = serializer.data
            return Response({'count': len(data), 'tasks': data})
        except:
            return Response({'Error': 'Не удалось загрузить задачи.'}, status=406)

    @action(detail=False, methods=['post'])
    def upload_tasks(self, request):
        """
        Upload multiple tasks at once.
        """
        tasks_data = request.data.get('tasks', [])
        if not isinstance(tasks_data, list):
            return Response(
                {"error": "Expected a list of tasks."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=tasks_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": f"{len(tasks_data)} tasks have been created."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def upload_task(self, request):
        tasks_data = request.data

        serializer = self.get_serializer(data=tasks_data, many=False)
        if serializer.is_valid():
            saved_task = serializer.save()
            response_ser = TaskSerializerForCreate(saved_task)
            return Response(
                response_ser.data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()

        update_serializer = TaskSerializer(task, data=request.data, partial=True)
        if update_serializer.is_valid():
            updated_instance = update_serializer.save()
            response_serializer = TaskSerializerForCreate(updated_instance)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        # Вернуть ошибки валидации
        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def delete_all(self, request, *args, **kwargs):
        Task.objects.all().delete()
        return Response(
            {"message": "All objects have been deleted."},
            status=status.HTTP_204_NO_CONTENT
        )


class TaskInfoViewSet(viewsets.ViewSet):
    def get_permissions(self):
        permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @extend_schema(description='Get all task authors.')
    @action(detail=False, methods=['get'])
    def authors(self, request):
        authors = [{'id': author.id, 'name': author.name} for author in Author.objects.all()]
        return Response({
            'authors': authors,
        })

    @extend_schema(description='Get all task sources.')
    @action(detail=False, methods=['get'])
    def sources(self, request):
        sources = [{'id': source.id, 'name': source.name} for source in TaskSource.objects.all()]
        return Response({
            'sources': sources,
        })

    @extend_schema(description='Get all task difficulty levels.')
    @action(detail=False, methods=['get'], url_path='dlevels')
    def difficulty_level(self, request):
        d_levels = [{'id': d_level.id, 'name': d_level.name} for d_level in DifficultyLevel.objects.all()]
        return Response({
            'd_level': d_levels,
        })

    @extend_schema(description='Get all task topics.')
    @action(detail=False, methods=['get'], url_path='topics')
    def task_topic(self, request):
        topics = [{'id': topic.id, 'name': topic.name} for topic in TaskTopic.objects.all()]
        return Response({
            'topics': topics,
        })


class TaskSolutionsViewSet(viewsets.ModelViewSet):
    queryset = TaskSolutions.objects.all()
    serializer_class = TaskSolutionsSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'my', 'new_tasks', 'by_task_id', 'count_users_who_solved_task',
                           'percent_ok_solves_by_task_id', 'send_solution']:
            permission_classes = [IsAuthenticated]
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @extend_schema(description='Send solution for task.')
    @action(detail=False, methods=['post'], url_path='send-solution')
    def send_solution(self, request):
        try:
            cur_user_id = request.user.id
            cur_task_id = request.data['task_id']
            user_answer = request.data['answer']

            task = Task.objects.all().filter(id=cur_task_id)[0]
            ok_answer_data = json.loads(task.answer)
            ok_answer_type = task.answer_type
            ok_answer = {'type': ok_answer_type}
            ok_answer[ok_answer_type] = ok_answer_data

            print(cur_task_id, user_answer, ok_answer)
            solution = TaskSolutions(task_id=cur_task_id,
                                     user_id=cur_user_id,
                                     answer=user_answer,
                                     is_ok_solution=check_answer(user_answer, ok_answer))

            solution.save()
            serializer = TaskSolutionsSerializer(solution, many=False)
            data = serializer.data

            return Response({
                'solution': data,
            })
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обработать решение.',
            })

    @extend_schema(description='Get all user solutions.')
    @action(detail=False, methods=['get'])
    def my(self, request):
        cur_user_id = request.user.id

        count_tasks = Task.objects.all().filter(is_available_in_bank=True).count()
        solutions = TaskSolutions.objects.all().filter(user_id=cur_user_id)

        # Все решения
        serializer = TaskSolutionsSerializer(solutions, many=True)
        all_solutions = serializer.data

        # Количество правильных решений, уникальных задач
        count_ok_solutions = solutions.filter(is_ok_solution=True).values('task_id').annotate((Count('id'))).count()

        return Response({
            'count': {
                'all_tasks_count': count_tasks,
                'all_solutions_count': len(all_solutions),
                'count_ok_solutions_all_time': count_ok_solutions},
            'all-solutions': all_solutions,
        })

    @extend_schema(description='Get all solutions by task id for current user.')
    @action(detail=False, methods=['get'], url_path='by-task-id')
    def by_task_id(self, request):
        try:
            cur_user_id = request.user.id

            solutions = TaskSolutions.objects.all().filter(user_id=cur_user_id, task_id=request.data['task-id'])
            serializer = TaskSolutionsSerializer(solutions, many=True)
            data = serializer.data
            return Response({
                'count': len(data),
                'solutions': data
            })
        except:
            return Response({
                'Error': 'Не удалось получить решения.'
            }, status=406)

    @action(detail=False, methods=['post'])
    def get_statuses(self, request):
        try:
            cur_user_id = request.user.id
            task_ids = request.data['task_ids']
            print([task_ids])
            tasks = Task.objects.filter(id__in=task_ids)
            tasks_with_counts = tasks.annotate(
                correct_solutions=Count('tasksolutions',
                                        filter=Q(tasksolutions__user_id=cur_user_id,
                                                 tasksolutions__is_ok_solution=True)),
                incorrect_solutions=Count('tasksolutions',
                                          filter=Q(tasksolutions__user_id=cur_user_id,
                                                   tasksolutions__is_ok_solution=False)))
            id_status = {}
            for task in tasks_with_counts:
                if task.correct_solutions > 0:
                    id_status[task.id] = 'ok'
                elif task.incorrect_solutions > 0:
                    id_status[task.id] = 'wa'
            return Response(id_status)
        except:
            return Response({
                'Error': 'Не удалось получить статусы.'
            }, status=406)

    @extend_schema(description='Get count users, who solved task.')
    @action(detail=False, methods=['get'], url_path='count-ok-by-task-id')
    def count_users_who_solved_task(self, request):
        try:
            cur_user_id = request.user.id
            cur_task_id = request.data['task-id']
            count = TaskSolutions.objects.all().filter(user_id=cur_user_id, task_id=cur_task_id) \
                .values('user_id').annotate((Count('id'))).count()

            return Response({
                'count-unique-ok-solves': count
            })
        except:
            return Response({
                'Error': 'Не удалось получить решения.'
            }, status=406)

    @extend_schema(description='Get percent of ok solutions for task by task id.')
    @action(detail=False, methods=['get'], url_path='percent-ok-by-task-id')
    def percent_ok_solves_by_task_id(self, request):
        try:
            cur_task_id = request.data['task-id']
            count_all = TaskSolutions.objects.all().filter(task_id=cur_task_id).count()
            count_ok = TaskSolutions.objects.all().filter(task_id=cur_task_id, is_ok_solution=True).count()
            a = 1
            return Response({
                'percent-ok-solves': int(count_ok / count_all * 100)
            })
        except:
            return Response({
                'Error': 'Не удалось получить процент.'
            }, status=406)


class FilterForTaskViewSet(viewsets.ModelViewSet):
    queryset = TaskExam.objects.all()
    serializer_class = FilterSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'filtered', 'new_tasks', 'get_numbers']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'])
    def get_numbers(self, request):
        try:
            if ('subjectSlug' not in request.data) or ('examSlug' not in request.data):
                return Response({
                    'Error': 'Не указан экзамен или предмет.'
                }, status=406)

            cur_subject_slug = request.data['subjectSlug']
            cur_exam_slug = request.data['examSlug']
            numbers = TaskNumberInExam.objects.all().filter(subject__slug=cur_subject_slug).filter(
                subject__exam__slug=cur_exam_slug)
            serializer = TaskNumberInExamSerializer(numbers, many=True)

            data = serializer.data
            return Response({
                'numbers': data
            })
        except:
            return Response({
                'Error': 'error'
            }, status=406)


class NumbersViewSet(viewsets.ModelViewSet):
    queryset = TaskNumberInExam.objects.all()
    serializer_class = TaskNumberInExamSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]


@extend_schema(description='Uploading a file to the server.')
@api_view(['POST'])
@permission_classes([IsAdminUser])
def upload_file(request):
    try:
        file = request.FILES['file']
        fp = UploadFiles(file=file)
        fp.save()
        return Response({
            'file_url': f'{DOMEN}media/{fp.file}',
        }, status=406)
    except:
        return Response({
            'error': 'File did not save.',
        }, status=406)
