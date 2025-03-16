from rest_framework import serializers

from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask
from tasks.serializers import TaskSerializerForUser
from users.serializers import UserSerializer


class TaskCollectionInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'is_exam', 'description', 'time_create', 'time_update']


class TaskCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'is_exam', 'description', 'tasks', 'time_create', 'time_update']


class TaskCollectionGetSerializer(serializers.ModelSerializer):
    # tasks = TaskSerializerForUser(many=True)
    # tasks = serializers.SerializerMethodField()

    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'is_exam', 'description', 'time_create', 'time_update']

    # def get_tasks(self, collection):
    #     collection_tasks = collection.taskcollectiontasks.order_by('order')
    #     tasks = [ct.task for ct in collection_tasks]
    #     return TaskSerializerForUser(tasks, many=True).data


class TaskCollectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'is_exam', 'description', 'created_by', 'subject', 'time_create', 'time_update']


class TaskCollectionTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionTask
        fields = '__all__'


# class TaskCollectionTaskForUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TaskCollectionTask
#         fields = '__all__'
#         depth = 2


class TaskCollectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionSolve
        fields = '__all__'


class TaskCollectionSolveForUserSerializer(serializers.ModelSerializer):
    task_collection = TaskCollectionInfoSerializer(many=False)

    class Meta:
        model = TaskCollectionSolve
        fields = ['id', 'task_collection', 'score', 'test_score', 'duration', 'answers', 'time_create', ]


class TaskCollectionSolveForAllSolSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TaskCollectionSolve
        fields = ['id', 'user', 'score', 'test_score', 'duration', 'answers', 'time_create']
