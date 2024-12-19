from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from urllib3 import request

from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask
from taskcollections.serializers import TaskCollectionSerializer, TaskCollectionSolveSerializer, \
    TaskCollectionCreateSerializer, TaskCollectionTaskSerializer
from rest_framework.response import Response

from tasks.models import Task
from tasks.serializers import TaskSerializer, TaskSerializerForUser


class TaskCollectionViewSet(viewsets.ModelViewSet):
    queryset = TaskCollection.objects.all()
    serializer_class = TaskCollectionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

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

    @action(detail=False, methods=['post'])
    def update_collection(self, request):
        try:
            cur_user_id = request.user.id

            collection = TaskCollection.objects.get(id=request.data['id'])
            if cur_user_id != collection.created_by.id:
                Response({"detail": "У вас нет прав на редактирование этой задачи."}, status=status.HTTP_403_FORBIDDEN)

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
                task_serializer = TaskSerializer(task_obj, data=task['info'], partial=True)
                if task_serializer.is_valid():
                    task_serializer.save()
                    updated_tasks.append(task_serializer.data)

            # Update task ids in collection
            tasks_to_delete = list(TaskCollectionTask.objects.filter(task_collection=collection).values())
            TaskCollectionTask.objects.filter(task_collection=collection).delete()

            old_task_ids = TaskCollectionTask.objects.filter(task_collection=collection)
            old_task_ids.delete()

            data = []
            for i, task in enumerate(request.data['tasks']):
                task_id = task['id']
                data.append({'task_collection': collection.id, 'task':task_id, 'order':i})
                print({'task_collection': collection.id, 'task':task_id, 'order':i})
            serializer = TaskCollectionTaskSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
                response['tasks'] = updated_tasks
            else:
                print('Error', serializer.errors)
                TaskCollectionTask.objects.bulk_create([TaskCollectionTask(**data) for data in tasks_to_delete])
            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({
                'Error': 'Не удалось обновить подборку.',
            })


###################
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

            cur_col_id = request.data['col_id']
            user_answers = request.data['answers']
            duration = request.data['duration']

            # Count ok answers
            score = 0
            for task in TaskCollection.objects.filter(id=1)[0].tasks.all():
                if str(task.id) in user_answers:
                    if str(task.answer) == str(user_answers[str(task.id)]):
                        score += 1

            solve = TaskCollectionSolve(
                task_collection_id=cur_col_id,
                user_id=cur_user_id,
                answers=user_answers,
                score=score,
                duration=duration
            )
            solve.save()

            serializer = TaskCollectionSolveSerializer(solve, many=False)
            data = serializer.data
            return Response({
                'solution': data,
            })
        except:
            return Response({
                'Error': 'Не удалось обработать запрос.',
            })
