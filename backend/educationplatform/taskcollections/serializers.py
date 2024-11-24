from rest_framework import serializers

from taskcollections.models import TaskCollection, TaskCollectionSolve


class TaskCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = '__all__'


class TaskCollectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionSolve
        fields = '__all__'
