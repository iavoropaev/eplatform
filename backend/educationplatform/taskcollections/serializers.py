from rest_framework import serializers

from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask
from tasks.serializers import TaskSerializerForUser


class TaskCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'description','tasks', 'time_create',  'time_update']
        #depth = 2

class TaskCollectionGetSerializer(serializers.ModelSerializer):
    tasks = TaskSerializerForUser(many=True)
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'description', 'tasks', 'time_create',  'time_update']

class TaskCollectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'description', 'created_by', 'time_create', 'time_update']
        #depth = 2

class TaskCollectionTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionTask
        fields = '__all__'
        #depth = 2
class TaskCollectionTaskForUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionTask
        fields = '__all__'
        depth = 2

class TaskCollectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionSolve
        fields = '__all__'
        # depth = 2
