import json
import random

from django.db import connection
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.status import HTTP_400_BAD_REQUEST

from classes.models import Class
from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask
from taskcollections.serializers import TaskCollectionSerializer, TaskCollectionSolveSerializer, \
    TaskCollectionCreateSerializer, TaskCollectionTaskSerializer, \
    TaskCollectionGetSerializer, TaskCollectionSolveForUserSerializer, TaskCollectionInfoSerializer, \
    TaskCollectionSolveForAllSolSerializer
from rest_framework.response import Response

from tasks.models import Task
from tasks.serializers import TaskSerializerForUser
from tasks.utils import check_answer


class TaskCollectionViewSet(viewsets.ModelViewSet):
    queryset = TaskCollection.objects.all()
    serializer_class = TaskCollectionSerializer
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TaskCollectionGetSerializer
        return TaskCollectionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'post', 'get_collections']:
            permission_classes = [AllowAny]
        elif self.action in ['create_collection', 'update_collection', 'generate_collection']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        queryset = TaskCollection.objects

        obj = get_object_or_404(queryset, slug=kwargs["slug"])
        serializer = self.get_serializer(obj)
        response = dict(serializer.data)

        links = obj.taskcollectiontasks.select_related('task', 'task__author', 'task__source', 'task__number_in_exam',
                                                       'task__difficulty_level', 'task__actuality').order_by('order')
        tasks = [TaskSerializerForUser(task.task).data for task in links]
        response['tasks'] = tasks
        return Response(response)

    @action(detail=False, methods=['post'])
    def create_collection(self, request):
        try:
            cur_user_id = request.user.id
            data = request.data | {'created_by': cur_user_id}
            serializer = TaskCollectionCreateSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'Error': 'Не удалось создать подборку.',
            })

    @action(detail=False, methods=['get'])
    def get_collections(self, request):
        queryset = TaskCollection.objects.all().filter(is_public=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='my-collections')
    def my_collections(self, request):
        cur_user_id = request.user.id
        queryset = TaskCollection.objects.all().filter(created_by=cur_user_id)
        serializer = TaskCollectionInfoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def update_collection(self, request):
        try:
            cur_user_id = request.user.id

            if 'id' in request.data:
                collection = TaskCollection.objects.select_related('created_by').get(id=request.data['id'])
            elif 'slug' in request.data:
                collection = TaskCollection.objects.select_related('created_by').get(slug=request.data['slug'])
            else:
                return Response({"detail": "Подборка не найдена."},
                                status=status.HTTP_404_NOT_FOUND)

            if cur_user_id != collection.created_by.id:
                return Response({"detail": "У вас нет прав на редактирование этой подборки."},
                                status=status.HTTP_403_FORBIDDEN)

            # Update collection info
            serializer = TaskCollectionCreateSerializer(collection, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response = serializer.data
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Update task ids in collection
            tasks_to_delete = list(TaskCollectionTask.objects.filter(task_collection=collection).values('id'))
            old_task_ids = TaskCollectionTask.objects.filter(task_collection=collection)
            old_task_ids.delete()

            task_instances = [
                TaskCollectionTask(task_collection=collection, task_id=task['id'], order=i)
                for i, task in enumerate(request.data['tasks'])
            ]

            try:
                TaskCollectionTask.objects.bulk_create(task_instances)
            except Exception:
                TaskCollectionTask.objects.bulk_create([TaskCollectionTask(**data) for data in tasks_to_delete])

            links = collection.taskcollectiontasks.select_related('task', 'task__author', 'task__source',
                                                                  'task__number_in_exam',
                                                                  'task__difficulty_level',
                                                                  'task__actuality').order_by('order')
            tasks = [TaskSerializerForUser(task.task).data for task in links]
            response['tasks'] = tasks

            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обновить подборку.',
            })

    @action(detail=False, methods=['post'], url_path='generate-collection')
    def generate_collection(self, request):
        try:
            cur_user_id = request.user.id

            selected_tasks_ids = []
            data = request.data
            collection_data = {'name': data['name'], 'slug': data['slug'],
                               'description': data['description'],
                               'created_by': cur_user_id}
            for number_info in data['generateParams']:
                count = number_info['count']
                number_id = number_info['number']['id']
                difficulty_id = number_info['difficulty']
                author_id = number_info['author']
                actuality_id = number_info['actuality']

                filters = Q(number_in_exam_id=number_id)

                if difficulty_id != '-':
                    filters &= Q(difficulty_level_id=difficulty_id)
                if author_id != '-':
                    filters &= Q(author_id=author_id)
                if actuality_id != '-':
                    filters &= Q(actuality_id=actuality_id)

                task_ids = Task.objects.filter(filters).values_list('id', flat=True)
                selected_tasks_ids.extend(random.sample(list(task_ids), min(count, len(task_ids))))

            serializer = TaskCollectionCreateSerializer(data=collection_data)

            if serializer.is_valid():
                created_collection = serializer.save()
                links = []
                for i, task_id in enumerate(selected_tasks_ids):
                    links.append({'task_collection': created_collection.id, 'task': task_id, 'order': i})
                links_serializer = TaskCollectionTaskSerializer(data=links, many=True)
                if links_serializer.is_valid():
                    links_serializer.save()
                user_serializer = TaskCollectionGetSerializer(created_collection)
                queries = connection.queries
                print(f"Количество запросов: {len(queries)}")
                return Response(user_serializer.data, status=201)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось создать подборку.',
            }, status=HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='delete-collection')
    def delete_collection(self, request):
        try:
            cur_user_id = request.user.id
            coll_id = request.data['collection_id']
            cur_coll = TaskCollection.objects.filter(id=coll_id).get()

            if cur_coll.created_by.id != cur_user_id:
                return Response(status=406)
            cur_coll.delete()
            return Response("deleted")

        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось создать подборку.',
            }, status=400)


class TaskCollectionSolveViewSet(viewsets.ModelViewSet):
    queryset = TaskCollectionSolve.objects.all()
    serializer_class = TaskCollectionSolveSerializer

    def get_permissions(self):
        if self.action in ['send_solution', 'get_solution', 'get_my_solutions', 'delete-solution',
                           'get_all_solutions_for_exam']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @extend_schema(description='Send solution for task collection.')
    @action(detail=False, methods=['post'], url_path='send-solution')
    def send_solution(self, request):
        try:
            cur_user_id = request.user.id
            cur_col_slug = request.data['col_slug']
            user_answers = request.data['answers']
            duration = request.data['duration']

            collection = TaskCollection.objects.all().filter(slug=cur_col_slug).first()

            answers_summary = []
            total_score = 0
            for task in collection.tasks.all().values('id', 'answer', 'answer_type', 'number_in_exam__name'):
                task_id = task['id']
                ok_answer_type = task['answer_type']
                print(task_id, ok_answer_type, task['answer'])
                ok_answer = {'type': ok_answer_type, ok_answer_type: json.loads(task['answer'])}
                score = 0
                if str(task_id) in user_answers:
                    user_answer = user_answers[str(task_id)]

                    if check_answer(user_answer, ok_answer):
                        score = 1
                        status = 'OK'
                    else:
                        status = 'WA'
                    total_score += score
                else:
                    status = 'NA'
                    user_answer = {}
                answers_summary.append({"task_id": task_id,
                                        "number_in_exam": task['number_in_exam__name'],
                                        "user_answer": user_answer,
                                        "ok_answer": ok_answer,
                                        "score": score,
                                        'status': status})

            solve = TaskCollectionSolve(
                task_collection_id=collection.id,
                user_id=cur_user_id,
                answers=answers_summary,
                score=total_score,
                duration=duration
            )
            solve.save()

            serializer = TaskCollectionSolveSerializer(solve, many=False)
            data = serializer.data
            return Response({
                'solution': data,
                'col_slug': cur_col_slug,
                'answers': answers_summary
            })
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @action(detail=False, methods=['get'], url_path='get-solution')
    def get_solution(self, request):
        try:
            user_id = request.user.id
            col_slug = request.query_params.get('col_slug', None)
            sol_type = request.query_params.get('sol_type', None)

            solve = TaskCollectionSolve.objects.all().filter(user__id=user_id, task_collection__slug=col_slug)
            if sol_type == 'last':
                solve = solve.order_by('time_create').last()
            elif sol_type == 'first':
                solve = solve.order_by('time_create').first()
            elif sol_type == 'best':
                solve = solve.order_by('-score', '-time_create').first()
            else:
                solve = solve.first()

            serializer = TaskCollectionSolveForUserSerializer(solve, many=False)
            data = serializer.data

            return Response(data, status=200)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @action(detail=False, methods=['get'], url_path='get-my-solutions')
    def get_my_solutions(self, request):
        try:
            user_id = request.user.id
            solves = TaskCollectionSolve.objects.select_related('task_collection').filter(user__id=user_id).order_by(
                '-time_create')

            serializer = TaskCollectionSolveForUserSerializer(solves, many=True)
            data = serializer.data
            print(f"Количество SQL-запросов: {len(connection.queries)}")
            return Response(data, status=200)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @action(detail=False, methods=['get'], url_path='get-my-student-solutions')
    def get_my_student_solutions(self, request):
        try:
            user_id = request.user.id
            student_id = request.query_params.get('student_id', None)
            print(student_id)
            solves = TaskCollectionSolve.objects.select_related('task_collection').filter(user__id=student_id).order_by(
                '-time_create')

            serializer = TaskCollectionSolveForUserSerializer(solves, many=True)
            data = serializer.data
            print(f"Количество SQL-запросов: {len(connection.queries)}")
            return Response(data, status=200)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })

    @action(detail=False, methods=['get'], url_path='get-all-solutions-for-exam')
    def get_all_solutions_for_exam(self, request):
        try:
            user_id = request.user.id
            is_staff = request.user.is_staff

            col_slug = request.query_params.get('col_slug', None)
            class_id = request.query_params.get('class_id', None)
            if class_id == '-1':
                class_id = None

            collection = TaskCollection.objects.filter(slug=col_slug).select_related('created_by').get()
            if class_id:
                cur_class = Class.objects.filter(id=class_id).select_related('created_by').get()
            else:
                cur_class = None

            if cur_class and (cur_class.created_by.id != user_id) and (not is_staff):
                return Response("Forbidden", status=406)
            if (collection.created_by.id != user_id) and (not is_staff) and (not cur_class):
                return Response("Forbidden", status=406)

            collection_info = TaskCollectionInfoSerializer(collection).data

            solves = TaskCollectionSolve.objects.select_related('user').filter(task_collection__slug=col_slug)
            if cur_class:
                solves = solves.filter(user__in=cur_class.students.all())
            solves = TaskCollectionSolveForAllSolSerializer(solves, many=True).data
            response = {'col_info': collection_info, "solves": solves}
            print(f"Количество SQL-запросов: {len(connection.queries)}")
            return Response(response, status=200)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обработать запрос.',
            }, status=400)

    @action(detail=False, methods=['post'], url_path='delete-solution')
    def delete_solution(self, request):
        try:
            user_id = request.user.id
            solution_id = request.data['solution_id']

            solution = TaskCollectionSolve.objects.get(id=solution_id)
            if solution.user.id == user_id:
                solution.delete()
            else:
                return Response({
                    'Error': 'Не удалось обработать запрос.',
                }, status=406)
            return Response('deleted', status=200)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            }, status=400)
