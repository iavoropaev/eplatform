from rest_framework import serializers

from .models import Task, TaskSolutions, TaskNumberInExam, TaskExam, TaskSubject, TaskSource, Author, DifficultyLevel, \
    TaskBankAuthor, Actuality


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'content', 'author', 'source', 'answer', 'topic', 'time_create', 'difficulty_level',
                  'time_update')
        fields = '__all__'



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
        fields = ['name']


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


    class Meta:
        model = TaskSubject
        fields = ['id', 'name', 'slug', 'numbers', 'sources', 'authors']


class FilterSerializer(serializers.ModelSerializer):
    subjects = TaskSubjectSerializer(many=True, read_only=True)
    dif_levels = TaskDifficultyLevelSerializer(many=True, read_only=True)

    class Meta:
        model = TaskExam
        fields = ('id', 'name', 'slug', 'subjects', 'dif_levels')


class TaskSerializerForUser(serializers.ModelSerializer):
    author = TaskAuthorSerializer()
    number_in_exam = TaskNumberInExamSerializer()
    source = TaskSourceSerializer()

    class Meta:
        model = Task
        fields = ('id', 'content', 'number_in_exam', 'author', 'source', 'answer_type', 'answer', 'difficulty_level',
                  'time_update', 'time_create')
