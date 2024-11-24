from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from taskcollections.models import TaskCollection, TaskCollectionSolve
from taskcollections.serializers import TaskCollectionSerializer, TaskCollectionSolveSerializer
from rest_framework.response import Response


class TaskCollectionViewSet(viewsets.ModelViewSet):
    queryset = TaskCollection.objects.all()
    serializer_class = TaskCollectionSerializer

    def get_permissions(self):
        permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


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
