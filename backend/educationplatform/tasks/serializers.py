import json

from rest_framework import serializers

from .models import Task, TaskSolutions, TaskNumberInExam, TaskExam, TaskSubject, TaskSource, Author, DifficultyLevel, \
    TaskBankAuthor


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'content', 'author', 'source', 'answer', 'topic', 'time_create', 'difficulty_level',
                  'time_update')
        fields = '__all__'
        #depth = 2



class TaskSerializerForUser(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'content', 'author', 'source', 'answer', 'topic', 'time_create', 'difficulty_level',
                  'time_update')
        fields = ('answer_type', 'id')
        fields = '__all__'
        depth = 2




class TaskSerializerForCreate(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        depth = 3


class TaskSolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSolutions
        fields = '__all__'


class TaskDifficultyLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = DifficultyLevel
        fields = ['id', 'name']

class TaskAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']

class TaskSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSource
        fields = ['name', 'slug']

###
class TaskBankAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskBankAuthor
        fields = '__all__'

class TaskNumberInExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskNumberInExam
        fields = '__all__'


class TaskSubjectSerializer(serializers.ModelSerializer):
    numbers = TaskNumberInExamSerializer(many=True, read_only=True)
    sources = TaskBankAuthorSerializer(many=True, read_only=True)
    authors = TaskAuthorSerializer(many=True, read_only=True)
    difficulty_levels = TaskAuthorSerializer(many=True, read_only=True)
    class Meta:
        model = TaskSubject
        fields = ['id','name', 'slug', 'numbers', 'sources', 'authors', 'difficulty_levels']
  
class FilterSerializer(serializers.ModelSerializer):
    subjects = TaskSubjectSerializer(many=True, read_only=True)

    class Meta:
        model = TaskExam
        fields = ('id', 'name', 'slug', 'subjects')