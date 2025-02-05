import json

from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask
from taskcollections.serializers import TaskCollectionSerializer, TaskCollectionSolveSerializer, \
    TaskCollectionCreateSerializer, TaskCollectionTaskSerializer, TaskCollectionTaskForUserSerializer, \
    TaskCollectionGetSerializer, TaskCollectionSolveForUserSerializer
from rest_framework.response import Response

from tasks.models import Task
from tasks.serializers import TaskSerializer, TaskSerializerForUser
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
        if self.action in ['list', 'retrieve', 'post']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

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

    @action(detail=False, methods=['post'])
    def update_collection(self, request):
        try:
            cur_user_id = request.user.id

            if 'id' in request.data:
                collection = TaskCollection.objects.get(id=request.data['id'])
            elif 'slug' in request.data:
                collection = TaskCollection.objects.get(slug=request.data['slug'])
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

            # Update tasks
            updated_tasks = []
            for task in request.data['tasks']:
                task_obj = Task.objects.get(id=task['id'])
                if task['info']:
                    task_serializer = TaskSerializer(task_obj, data=task['info'], partial=True)
                    if task_serializer.is_valid():
                        task_serializer.save()
                        task_user_serializer = TaskSerializerForUser(task_obj)
                        updated_tasks.append(task_user_serializer.data)
                else:
                    task_user_serializer = TaskSerializerForUser(task_obj)
                    updated_tasks.append(task_user_serializer.data)

            # Update task ids in collection
            tasks_to_delete = list(TaskCollectionTask.objects.filter(task_collection=collection).values())
            TaskCollectionTask.objects.filter(task_collection=collection).delete()

            old_task_ids = TaskCollectionTask.objects.filter(task_collection=collection)
            old_task_ids.delete()

            data = []
            for i, task in enumerate(request.data['tasks']):
                task_id = task['id']
                data.append({'task_collection': collection.id, 'task': task_id, 'order': i})
            serializer = TaskCollectionTaskSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
                response['tasks'] = updated_tasks
            else:
                TaskCollectionTask.objects.bulk_create([TaskCollectionTask(**data) for data in tasks_to_delete])
            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обновить подборку.',
            })


class TaskCollectionSolveViewSet(viewsets.ModelViewSet):
    queryset = TaskCollectionSolve.objects.all()
    serializer_class = TaskCollectionSolveSerializer

    def get_permissions(self):
        if self.action in ['send_solution']:
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
            print(user_answers)
            collection = TaskCollection.objects.all().filter(slug=cur_col_slug).first()

            answers_summary = []
            total_score = 0
            for task in collection.tasks.all().values('id', 'answer', 'answer_type', 'number_in_exam__name'):
                task_id = task['id']
                ok_answer_type = task['answer_type']
                ok_answer = {'type': ok_answer_type, ok_answer_type: json.loads(task['answer'])}
                score = 0
                if str(task_id) in user_answers:
                    user_answer = user_answers[str(task_id)]
                    print(user_answer, ok_answer)
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
            print(answers_summary)
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
            return Response(data)
        except Exception as e:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })
