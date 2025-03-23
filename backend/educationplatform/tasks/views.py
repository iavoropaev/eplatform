import datetime
import json
import pytz

from django.core.paginator import Paginator
from django.db import connection
from django.db.models import Count, Q, OuterRef, Subquery, BooleanField, ExpressionWrapper, FloatField, F, Exists, \
    Value, Case, When
from django.db.models.functions import Coalesce
from drf_spectacular.utils import extend_schema

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from urllib3 import request

from educationplatform.settings import DOMAIN
from .models import Task, UploadFiles, TaskAuthor, TaskSource, DifficultyLevel, TaskTopic, TaskSolutions, \
    TaskNumberInExam, \
    TaskExam, Actuality
from .serializers import TaskSerializer, TaskSerializerForUser, TaskSolutionsSerializer, FilterSerializer, \
    TaskNumberInExamSerializer, TaskSerializerForCreate
from .utils import check_answer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return TaskSerializerForCreate
        return TaskSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'filtered', 'new_tasks']:
            permission_classes = [AllowAny]
        elif self.action in ['upload_task', 'partial_update', 'task_with_ans_by_id', 'my_tasks']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'], url_path='task-with-ans-by-id')
    def task_with_ans_by_id(self, request):
        try:
            task_id = request.data['task_id']
            task = Task.objects.select_related(
                'author', 'source', 'number_in_exam', 'difficulty_level', 'actuality'
            ).filter(id=task_id).first()
            if (task.created_by != request.user) and (not request.user.is_staff):
                return Response('Доступ запрещен.', status=status.HTTP_403_FORBIDDEN)

            serializer = TaskSerializerForCreate(task, many=False)
            print(len(connection.queries))
            return Response(serializer.data, status=200)
        except:
            return Response({'Error': 'Не удалось загрузить задачи.'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(description='''Get tasks filtered by authors, sources, topics, create time. Ordering by create time. 
    Params: authors, sources, topics, d_levels, period(day, week, month).''')
    @action(detail=False, methods=['post'])
    def filtered(self, request):
        tasks = Task.objects.all().select_related(
            'author', 'source', 'number_in_exam', 'difficulty_level', 'actuality'
        ).prefetch_related('bank_authors')

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
        if 'dif_levels' in request.data and request.data['dif_levels']:
            tasks = tasks.filter(difficulty_level_id__in=request.data['dif_levels'])
        if 'actualities' in request.data and request.data['actualities']:
            tasks = tasks.filter(actuality_id__in=request.data['actualities'])

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
        tasks = tasks[:150]
        serializer = TaskSerializerForUser(tasks, many=True)
        data = serializer.data
        print('filtered', len(connection.queries))
        return Response({'count': len(data), 'tasks': data})

    @extend_schema(description='Get new tasks. Available periods: day, week, month.')
    @action(detail=False, methods=['get'], url_path='new')
    def new_tasks(self, request):
        try:
            cur_time = datetime.datetime.now(pytz.timezone('Europe/Moscow'))
            tasks = Task.objects.select_related(
                'author', 'source', 'number_in_exam', 'difficulty_level', 'actuality'
            ).filter(is_public=True)

            period = request.data['period']

            if period == 'day':
                tasks = tasks.filter(time_create__date=cur_time)
            elif period == 'week':
                tasks = tasks.filter(time_create__range=(cur_time - datetime.timedelta(days=7), cur_time))
            elif period == 'month':
                tasks = tasks.filter(time_create__range=(cur_time - datetime.timedelta(days=31), cur_time))
            else:
                return Response({'Error': 'Неверно указан период.'}, status=400)

            tasks = tasks.order_by('-time_create')

            serializer = TaskSerializerForUser(tasks, many=True)
            data = serializer.data
            print('my', len(connection.queries))
            return Response({'count': len(data), 'tasks': data})
        except Exception as e:
            print(e)
            return Response({'Error': 'Не удалось загрузить задачи.'}, status=400)

    @action(detail=False, methods=['get'], url_path='my')
    def my_tasks(self, request):
        try:
            cur_user_id = request.user.id
            tasks = Task.objects.select_related(
                'author', 'source', 'number_in_exam', 'difficulty_level', 'actuality'
            ).filter(created_by=cur_user_id)
            count_all = tasks.count()
            tasks = tasks.order_by('-time_create')[:10]  # !!!!!!!!!
            paginator = Paginator(tasks, 10 ** 6)
            tasks_page = paginator.get_page(1)
            tasks = tasks_page.object_list
            serializer = TaskSerializerForUser(tasks, many=True)
            data = serializer.data
            return Response({'count': count_all, 'tasks': data})
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
        try:
            task_data = request.data
            if not request.user.is_staff:
                task_data['bank_authors'] = []

            task_data['created_by'] = request.user.id
            serializer = self.get_serializer(data=task_data, many=False)
            if serializer.is_valid():
                saved_task = serializer.save()
                response_ser = TaskSerializerForCreate(saved_task)
                return Response(
                    response_ser.data,
                    status=status.HTTP_201_CREATED
                )
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()
        data = request.data.copy()
        if task.created_by != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if not request.user.is_staff:
            data.pop('bank_authors')

        update_serializer = TaskSerializer(task, data=data, partial=True)
        if update_serializer.is_valid():
            updated_instance = update_serializer.save()
            response_serializer = TaskSerializerForCreate(updated_instance)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @action(detail=False, methods=['post'])
    # def delete_all(self, request, *args, **kwargs):
    #     Task.objects.all().delete()
    #     return Response(
    #         {"message": "All objects have been deleted."},
    #         status=status.HTTP_204_NO_CONTENT
    #     )


class TaskInfoViewSet(viewsets.ViewSet):
    def get_permissions(self):
        permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @extend_schema(description='Get all task authors.')
    @action(detail=False, methods=['get'])
    def authors(self, request):
        authors = [{'id': author.id, 'name': author.name} for author in TaskAuthor.objects.all()]
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
        if self.action in ['new_tasks', 'send_solution']:
            permission_classes = [AllowAny]
        elif self.action in ['my', 'new_tasks', 'by_task_id', 'count_users_who_solved_task',
                             'percent_ok_solves_by_task_id', 'send_solution', 'get_statuses']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @extend_schema(description='Send solution for task.')
    @action(detail=False, methods=['post'], url_path='send-solution')
    def send_solution(self, request):
        try:
            cur_user_id = request.user.id
            cur_task_id = request.data['task_id']
            user_answer = request.data['answer']

            task = Task.objects.values("answer", "answer_type").get(id=cur_task_id)

            ok_answer_data = json.loads(task["answer"])
            ok_answer_type = task["answer_type"]
            ok_answer = {'type': ok_answer_type, ok_answer_type: ok_answer_data}

            if cur_user_id:
                solution = TaskSolutions(task_id=cur_task_id,
                                         user_id=cur_user_id,
                                         answer=user_answer,
                                         is_ok_solution=check_answer(user_answer, ok_answer))

                solution.save()
                serializer = TaskSolutionsSerializer(solution, many=False)
                data = serializer.data
                sol_status = 'ok' if data['is_ok_solution'] else 'wa'
            else:
                sol_status = 'ok' if check_answer(user_answer, ok_answer) else 'wa'

            print('my', len(connection.queries))
            return Response({
                'status': sol_status
            })
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обработать решение.',
                'status': 'wa'
            })

    @extend_schema(description='Get all user solutions.')
    @action(detail=False, methods=['get'])
    def my(self, request):
        cur_user_id = request.user.id

        count_tasks = Task.objects.all().filter(is_public=True).count()
        solutions = TaskSolutions.objects.all().filter(user_id=cur_user_id)

        # Все решения
        serializer = TaskSolutionsSerializer(solutions, many=True)
        all_solutions = serializer.data

        # Количество правильных решений, уникальных задач
        count_ok_solutions = solutions.filter(is_ok_solution=True).values('task_id').annotate((Count('id'))).count()
        print('my', len(connection.queries))
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
            tasks = Task.objects.filter(id__in=task_ids)
            tasks_with_counts = tasks.filter(id__in=task_ids).annotate(
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
    @action(detail=False, methods=['post'], url_path='count-ok-by-task-id')
    def count_users_who_solved_task(self, request):
        try:
            cur_user_id = request.user.id
            cur_task_id = request.data['task_id']
            count = TaskSolutions.objects.all().filter(user_id=cur_user_id, task_id=cur_task_id) \
                .values('user_id').annotate((Count('id'))).count()

            return Response({
                'count-unique-ok-solves': count
            })

        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось получить решения.'
            }, status=400)

    @extend_schema(description='Get percent of ok solutions for task by task id.')
    @action(detail=False, methods=['post'], url_path='percent-ok-by-task-id')
    def percent_ok_solves_by_task_id(self, request):
        try:
            cur_task_id = request.data['task_id']
            count_all = TaskSolutions.objects.all().filter(task_id=cur_task_id).count()
            count_ok = TaskSolutions.objects.all().filter(task_id=cur_task_id, is_ok_solution=True).count()
            return Response({
                'percent-ok-solves': int(count_ok / count_all * 100)
            })
        except:
            return Response({
                'Error': 'Не удалось получить процент.'
            }, status=406)

    @action(detail=False, methods=['get'], url_path='solves-statistics-by-subject')
    def solves_statistics_by_subject(self, request):
        try:
            subject_slug = request.query_params.get('subject_slug')
            if not subject_slug:
                return Response('Предмет не указан.', status=400)

            first_attempt = (
                TaskSolutions.objects
                .filter(task=OuterRef('pk'), user=request.user)
                .order_by('date')
                .values('is_ok_solution')[:1]
            )

            total_sub = (
                Task.objects
                .filter(number_in_exam=OuterRef('pk'), tasksolutions__user=request.user)
                .values('number_in_exam')
                .annotate(cnt=Count('pk', distinct=True))
                .values('cnt')
            )

            solved_sub = (
                Task.objects
                .filter(number_in_exam=OuterRef('pk'))
                .annotate(first_is_ok=Subquery(first_attempt, output_field=BooleanField()))
                .filter(first_is_ok=True)
                .values('number_in_exam')
                .annotate(cnt=Count('pk'))
                .values('cnt')
            )

            qs = (
                TaskNumberInExam.objects
                .filter(subject__slug=subject_slug)
                .annotate(
                    total_tried_tasks=Coalesce(Subquery(total_sub), Value(0)),
                    solved_tasks=Coalesce(Subquery(solved_sub), Value(0))
                )
                .annotate(
                    percent=Case(
                        When(total_tried_tasks=0, then=Value(0.0)),
                        default=ExpressionWrapper(
                            100 * F('solved_tasks') / F('total_tried_tasks'),
                            output_field=FloatField()
                        )
                    )
                ).values('id', 'name', 'total_tried_tasks', 'solved_tasks', 'percent')
            )
            res = list(qs)
            res.sort(key=lambda x: int(x['name'].replace('-', ' ').split()[1]))
            return Response(res)
        except Exception as e:
            return Response(status=400)


class FilterForTaskViewSet(viewsets.ModelViewSet):
    queryset = TaskExam.objects.all()
    serializer_class = FilterSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'filtered', 'new_tasks', 'get_numbers']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        task_exams = TaskExam.objects.prefetch_related('dif_levels', 'subjects', 'subjects__numbers',
                                                       'subjects__sources',
                                                       'subjects__authors').all()
        serializer = FilterSerializer(task_exams, many=True)
        actualities = [{'id': item.id, 'name': item.name} for item in Actuality.objects.all()]
        print('my', len(connection.queries))
        return Response({'exams': serializer.data, 'actualities': actualities})

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
@permission_classes([AllowAny])
def upload_file(request):
    try:
        file = request.FILES['file']
        fp = UploadFiles(file=file)
        fp.save()
        return Response({
            'location': f'{DOMAIN}media/{fp.file}',
        }, status=200)
    except:
        return Response({
            'error': 'File did not save.',
        }, status=406)
