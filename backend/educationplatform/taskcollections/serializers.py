from rest_framework import serializers

from taskcollections.models import TaskCollection, TaskCollectionSolve, TaskCollectionTask
from tasks.serializers import TaskSubjectNameSerializer
from users.serializers import UserSerializer, AchievementSerializer


class TaskCollectionInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'is_exam', 'description', 'time_create', 'time_update']


class TaskCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'subject', 'is_exam', 'description', 'tasks', 'time_create', 'time_update']


class TaskCollectionGetSerializer(serializers.ModelSerializer):
    subject = TaskSubjectNameSerializer()

    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'subject', 'is_exam', 'description', 'time_create', 'time_update']


class TaskCollectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['id', 'name', 'slug', 'is_exam', 'description', 'created_by', 'subject', 'time_create', 'time_update']


class TaskCollectionTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionTask
        fields = '__all__'


class TaskCollectionSolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollectionSolve
        fields = '__all__'


class TaskCollectionSolveForUserSerializer(serializers.ModelSerializer):
    task_collection = TaskCollectionInfoSerializer(many=False)
    achievements = AchievementSerializer(many=True)

    class Meta:
        model = TaskCollectionSolve
        fields = ['id', 'task_collection', 'score', 'max_score', 'test_score', 'duration', 'answers', 'achievements',
                  'time_create']


class TaskCollectionSolveForAllSolSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TaskCollectionSolve
        fields = ['id', 'user', 'score', 'test_score', 'duration', 'answers', 'time_create']
