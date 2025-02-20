from rest_framework import serializers

from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask
from tasks.models import Task
from tasks.serializers import TaskSerializerForUser, TaskSerializer


class TaskCollectionInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'description', 'time_create', 'time_update']


class TaskCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'description', 'tasks', 'time_create', 'time_update']


class TaskCollectionGetSerializer(serializers.ModelSerializer):
    tasks = TaskSerializerForUser(many=True)

    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'description', 'tasks', 'time_create', 'time_update']


class TaskCollectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'description', 'created_by', 'time_create', 'time_update']


class TaskCollectionTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionTask
        fields = '__all__'


class TaskCollectionTaskForUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionTask
        fields = '__all__'
        depth = 2


class TaskCollectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionSolve
        fields = '__all__'


class TaskCollectionSolveForUserSerializer(serializers.ModelSerializer):
    task_collection = TaskCollectionInfoSerializer(many=False)

    class Meta:
        model = TaskCollectionSolve
        fields = ['id', 'task_collection', 'score', 'duration', 'answers', 'time_create', ]
