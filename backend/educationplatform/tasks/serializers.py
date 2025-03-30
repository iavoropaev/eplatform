from rest_framework import serializers

from .models import Task, TaskSolutions, TaskNumberInExam, TaskExam, TaskSubject, TaskSource, DifficultyLevel, \
    TaskBankAuthor, Actuality, TaskAuthor, UploadFiles


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'content', 'author', 'source', 'answer', 'topic', 'time_create', 'difficulty_level',
                  'time_update')
        fields = '__all__'


class TaskSerializerForCreate(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = ('created_by',)
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
        model = TaskAuthor
        fields = ['id', 'name', 'link']


class TaskSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSource
        fields = ['name']


class TaskBankAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskBankAuthor
        fields = '__all__'





class TaskActualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Actuality
        fields = '__all__'


class TaskExamNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskExam
        fields = ['id', 'name']



class TaskSubjectNameSerializer(serializers.ModelSerializer):
    exam = TaskExamNameSerializer()

    class Meta:
        model = TaskSubject
        fields = ['id', 'name', 'exam']

class TaskNumberInExamSerializer(serializers.ModelSerializer):
    subject = TaskSubjectNameSerializer(read_only=True)

    class Meta:
        model = TaskNumberInExam
        fields = ['id', 'name', 'subject']

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

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadFiles
        fields = ('id', 'name', 'location')

class TaskSerializerForUser(serializers.ModelSerializer):
    author = TaskAuthorSerializer()
    number_in_exam = TaskNumberInExamSerializer()
    source = TaskSourceSerializer()
    actuality = TaskActualitySerializer()
    difficulty_level = TaskDifficultyLevelSerializer()
    files = FileSerializer(many=True)
    #solution = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ('id', 'content', 'number_in_exam', 'author', 'source', 'answer_type', 'answer_data',
                  'difficulty_level', 'actuality',  'files', 'time_update', 'time_create')

    # def get_solution(self, obj):
    #     print([obj.solution])
    #     return obj.solution != ''



