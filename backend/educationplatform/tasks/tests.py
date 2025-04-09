import json

from django.test import TestCase
from django.core.files.base import ContentFile
from tasks.models import (
    TaskBankAuthor,
)
from tasks.serializers import (
    TaskSerializer, TaskSolutionsSerializer,
    TaskDifficultyLevelSerializer, TaskAuthorSerializer, TaskSourceSerializer,
    TaskBankAuthorSerializer, TaskActualitySerializer, TaskExamNameSerializer,
    TaskSubjectNameSerializer, TaskNumberInExamSerializer, TaskSubjectSerializer,
    FilterSerializer, TaskSerializerForUser
)
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from tasks.models import (
    Task, TaskExam, TaskSubject, DifficultyLevel, TaskAuthor, TaskSource,
    TaskNumberInExam, UploadFiles, TaskSolutions, Actuality
)
from tasks.serializers import FileSerializer


class SerializerTestCase(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username='testuser', password='12345', last_name='User')

        self.exam = TaskExam.objects.create(name="Экзамен", slug="exam")
        self.subject = TaskSubject.objects.create(name="Математика", slug="math", exam=self.exam)
        self.difficulty_level = DifficultyLevel.objects.create(name="Обычный", exam=self.exam)

        self.subject.difficulty_levels.add(self.difficulty_level)

        self.task_author = TaskAuthor.objects.create(name="Автор 1", link="http://example.com")
        self.actuality = Actuality.objects.create(name="Актуальная", priority=1)
        self.task_source = TaskSource.objects.create(name="Источник 1")

        self.task_number = TaskNumberInExam.objects.create(
            name="№1",
            check_rule="default",
            max_score=1,
            subject=self.subject
        )

        self.bank_author = TaskBankAuthor.objects.create(name="Автор 1", slug="bank-author", subject=self.subject)
        self.subject.authors.add(self.task_author)

        self.upload_file = UploadFiles.objects.create(
            created_by=self.user,
            file=ContentFile(b"----", name="dummy.txt"),
            name='файл',
            location='/uploads'
        )

        self.task = Task.objects.create(
            created_by=self.user,
            content='Содержание задачи',
            answer_type='text',
            answer='Ответ',
            solution='Решение',
            number_in_exam=self.task_number,
            author=self.task_author,
            source=self.task_source,
            difficulty_level=self.difficulty_level,
            actuality=self.actuality
        )
        self.task.files.add(self.upload_file)
        self.task.bank_authors.add(self.bank_author)

        self.task_solution = TaskSolutions.objects.create(
            task=self.task,
            user=self.user,
            answer='Ответ',
            score=1,
            is_ok_solution=True,
            status='OK'
        )

    def test_task_serializer(self):
        serializer = TaskSerializer(instance=self.task)
        data = serializer.data

        self.assertEqual(data['id'], self.task.id)
        self.assertEqual(data['content'], self.task.content)

        self.assertIn('created_by', data)
        self.assertIn('answer_type', data)
        self.assertIn('solution', data)

    def test_task_solutions_serializer(self):
        serializer = TaskSolutionsSerializer(instance=self.task_solution)
        data = serializer.data

        self.assertEqual(data['id'], self.task_solution.id)
        self.assertEqual(data['score'], self.task_solution.score)
        self.assertEqual(data['status'], self.task_solution.status)

    def test_task_difficulty_level_serializer(self):
        serializer = TaskDifficultyLevelSerializer(instance=self.difficulty_level)
        data = serializer.data

        self.assertEqual(data['id'], self.difficulty_level.id)
        self.assertEqual(data['name'], self.difficulty_level.name)

    def test_task_author_serializer(self):
        serializer = TaskAuthorSerializer(instance=self.task_author)
        data = serializer.data

        self.assertEqual(data['id'], self.task_author.id)
        self.assertEqual(data['name'], self.task_author.name)
        self.assertEqual(data['link'], self.task_author.link)

    def test_task_source_serializer(self):
        serializer = TaskSourceSerializer(instance=self.task_source)
        data = serializer.data

        self.assertEqual(data['name'], self.task_source.name)

    def test_task_bank_author_serializer(self):
        serializer = TaskBankAuthorSerializer(instance=self.bank_author)
        data = serializer.data

        self.assertEqual(data['name'], self.bank_author.name)
        self.assertEqual(data['slug'], self.bank_author.slug)
        self.assertEqual(data['subject'], self.bank_author.subject.id)

    def test_task_actuality_serializer(self):
        serializer = TaskActualitySerializer(instance=self.actuality)
        data = serializer.data

        self.assertEqual(data['name'], self.actuality.name)
        self.assertEqual(data['priority'], self.actuality.priority)

    def test_task_exam_name_serializer(self):
        serializer = TaskExamNameSerializer(instance=self.exam)
        data = serializer.data

        self.assertEqual(data['id'], self.exam.id)
        self.assertEqual(data['name'], self.exam.name)

    def test_task_subject_name_serializer(self):
        serializer = TaskSubjectNameSerializer(instance=self.subject)
        data = serializer.data

        self.assertEqual(data['id'], self.subject.id)
        self.assertEqual(data['name'], self.subject.name)
        self.assertIn('exam', data)
        self.assertEqual(data['exam']['id'], self.exam.id)
        self.assertEqual(data['exam']['name'], self.exam.name)

    def test_task_number_in_exam_serializer(self):
        serializer = TaskNumberInExamSerializer(instance=self.task_number)
        data = serializer.data

        self.assertEqual(data['id'], self.task_number.id)
        self.assertEqual(data['name'], self.task_number.name)
        self.assertIn('subject', data)
        self.assertEqual(data['subject']['id'], self.subject.id)
        self.assertEqual(data['max_score'], self.task_number.max_score)
        self.assertIsNone(data['answer_data'])

    def test_task_subject_serializer(self):
        serializer = TaskSubjectSerializer(instance=self.subject)
        data = serializer.data

        self.assertEqual(data['id'], self.subject.id)
        self.assertEqual(data['name'], self.subject.name)
        self.assertEqual(data['slug'], self.subject.slug)
        self.assertIsInstance(data['numbers'], list)
        self.assertEqual(len(data['numbers']), 1)
        self.assertIsInstance(data['sources'], list)
        self.assertEqual(len(data['sources']), 1)
        self.assertIsInstance(data['authors'], list)
        self.assertEqual(len(data['authors']), 1)
        self.assertEqual(data['authors'][0]['id'], self.task_author.id)

    def test_filter_serializer(self):
        serializer = FilterSerializer(instance=self.exam)
        data = serializer.data

        self.assertEqual(data['id'], self.exam.id)
        self.assertEqual(data['name'], self.exam.name)
        self.assertIsInstance(data['subjects'], list)
        self.assertEqual(len(data['subjects']), 1)
        self.assertEqual(data['subjects'][0]['id'], self.subject.id)
        self.assertIsInstance(data['dif_levels'], list)
        self.assertEqual(len(data['dif_levels']), 1)
        self.assertEqual(data['dif_levels'][0]['id'], self.difficulty_level.id)

    def test_file_serializer(self):
        serializer = FileSerializer(instance=self.upload_file)
        data = serializer.data

        self.assertEqual(data['id'], self.upload_file.id)
        self.assertEqual(data['name'], self.upload_file.name)
        self.assertEqual(data['location'], self.upload_file.location)

    def test_task_serializer_for_user(self):
        serializer = TaskSerializerForUser(instance=self.task)
        data = serializer.data

        self.assertEqual(data['id'], self.task.id)
        self.assertEqual(data['content'], self.task.content)
        self.assertEqual(data['author']['id'], self.task_author.id)
        self.assertEqual(data['number_in_exam']['id'], self.task_number.id)
        self.assertEqual(data['source']['name'], self.task_source.name)
        self.assertEqual(data['difficulty_level']['id'], self.difficulty_level.id)
        self.assertEqual(data['actuality']['name'], self.actuality.name)
        self.assertIsInstance(data['files'], list)
        self.assertEqual(len(data['files']), 1)
        self.assertTrue(data['solution'])


class TaskViewSetTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username='user', password='pwd')
        self.admin = User.objects.create_superuser(username='admin', password='pwd', email='admin@example.com')

        self.exam = TaskExam.objects.create(name="Экзамен", slug="exam")
        self.subject = TaskSubject.objects.create(name="Математика", slug="math", exam=self.exam)
        self.difficulty_level = DifficultyLevel.objects.create(name="Легкий", exam=self.exam)
        self.actuality = Actuality.objects.create(name="Актуально", priority=1)
        self.task_author = TaskAuthor.objects.create(name="Автор 1", link="////")
        self.task_source = TaskSource.objects.create(name="Источник 1")
        self.task_number = TaskNumberInExam.objects.create(
            name="1", check_rule="default", max_score=1, subject=self.subject
        )

        self.subject.difficulty_levels.add(self.difficulty_level)
        self.subject.authors.add(self.task_author)
        self.task = Task.objects.create(
            created_by=self.user,
            content="Содержание задачи",
            answer_type="text",
            answer="42",
            solution="Решение",
            number_in_exam=self.task_number,
            author=self.task_author,
            source=self.task_source,
            difficulty_level=self.difficulty_level,
            actuality=self.actuality
        )

    def test_task_with_ans_by_id_for_owner(self):
        url = "/api/v1/tasks/task-with-ans-by-id/"
        self.client.force_authenticate(user=self.user)
        data = {'task_id': self.task.id}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("id", response.data)
        self.assertEqual(response.data.get("solution"), self.task.solution)

    def test_task_with_ans_by_id_forbidden(self):
        other_user = get_user_model().objects.create_user(username='other', password='pwd')
        self.client.force_authenticate(user=other_user)
        url = "/api/v1/tasks/task-with-ans-by-id/"
        data = {'task_id': self.task.id}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_filtered_endpoint(self):
        url = "/api/v1/tasks/filtered/"
        self.client.force_authenticate(user=self.user)
        post_data = {
            "subject": self.subject.id,
            "authors": [self.task_author.id],
            "period": "day",
            "ordering": "new-first"
        }
        response = self.client.post(url, post_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("tasks", response.data)

    def test_my_tasks_endpoint(self):
        url = "/api/v1/tasks/my/"
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("tasks", response.data)

    def test_upload_tasks_endpoint(self):
        url = "/api/v1/tasks/upload_tasks/"
        self.client.force_authenticate(user=self.admin)
        tasks_data = [
            {
                "content": "Новая задача 1",
                "answer_type": "text",
                "answer": "Ответ 1",
                "solution": "Решение 1",
                "number_in_exam": self.task_number.id,
                "author": self.task_author.id,
                "source": self.task_source.id,
                "difficulty_level": self.difficulty_level.id,
                "actuality": self.actuality.id,
            },
            {
                "content": "Новая задача 2",
                "answer_type": "text",
                "answer": "Ответ 2",
                "solution": "Решение 2",
                "number_in_exam": self.task_number.id,
                "author": self.task_author.id,
                "source": self.task_source.id,
                "difficulty_level": self.difficulty_level.id,
                "actuality": self.actuality.id,
            }
        ]
        response = self.client.post(url, {"tasks": tasks_data}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)

    def test_upload_task_endpoint(self):
        url = "/api/v1/tasks/upload_task/"
        self.client.force_authenticate(user=self.user)
        task_data = {
            "content": "Задача...",
            "answer_type": "text",
            "answer": "Ответ",
            "solution": "Решение",
            "number_in_exam": self.task_number.id,
            "author": self.task_author.id,
            "source": self.task_source.id,
            "difficulty_level": self.difficulty_level.id,
            "actuality": self.actuality.id,
        }
        response = self.client.post(url, task_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("solution", response.data)


class TaskInfoViewSetTests(APITestCase):
    def setUp(self):
        self.author = TaskAuthor.objects.create(name="Автор", link="http://example.com")
        self.source = TaskSource.objects.create(name="Источник")
        self.d_level = DifficultyLevel.objects.create(name="Средний",
                                                      exam=TaskExam.objects.create(name="Экзамен2", slug="exam2"))

    def test_get_authors(self):
        url = "/api/v1/tasks-info/authors/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("authors", [])
        self.assertTrue(any(item["id"] == self.author.id for item in data))

    def test_get_sources(self):
        url = "/api/v1/tasks-info/sources/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("sources", [])
        self.assertTrue(any(item["id"] for item in data))

    def test_get_difficulty_levels(self):
        url = "/api/v1/tasks-info/dlevels/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("d_level", [])
        self.assertTrue(isinstance(data, list))


class TaskSolutionsViewSetTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username='user', password='pwd')
        self.task_author = TaskAuthor.objects.create(name="Автор")
        self.task_source = TaskSource.objects.create(name="Источник")
        self.exam = TaskExam.objects.create(name="Экзамен", slug="exam")
        self.subject = TaskSubject.objects.create(name="Физика", slug="physics", exam=self.exam)
        self.difficulty_level = DifficultyLevel.objects.create(name="Тяжелый", exam=self.exam)
        self.actuality = Actuality.objects.create(name="Актуальная", priority=2)
        self.task_number = TaskNumberInExam.objects.create(
            name="2", check_rule="default", max_score=2, subject=self.subject
        )
        self.subject.difficulty_levels.add(self.difficulty_level)
        self.subject.authors.add(self.task_author)

        self.task = Task.objects.create(
            created_by=self.user,
            content="Задача...",
            answer_type="text",
            answer=json.dumps("42"),
            solution="Решение",
            number_in_exam=self.task_number,
            author=self.task_author,
            source=self.task_source,
            difficulty_level=self.difficulty_level,
            actuality=self.actuality
        )

    def test_send_solution(self):
        url = "/api/v1/tasks-solutions/send-solution/"
        self.client.force_authenticate(user=self.user)
        post_data = {
            "task_id": self.task.id,
            "answer": "42"
        }
        response = self.client.post(url, post_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("score", response.data)
        self.assertIn("status", response.data)

    def test_my_solutions(self):
        TaskSolutions.objects.create(
            task=self.task,
            user=self.user,
            answer="42",
            is_ok_solution=True,
            score=2,
            status="OK"
        )
        url = "/api/v1/tasks-solutions/my/"
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("all-solutions", response.data)
        self.assertIn("count", response.data)


class FilterAndNumbersViewSetTests(APITestCase):
    def setUp(self):
        self.exam = TaskExam.objects.create(name="имя", slug="name")
        self.subject = TaskSubject.objects.create(name="math", slug="math", exam=self.exam)
        self.task_number = TaskNumberInExam.objects.create(name="3", check_rule="default", max_score=1,
                                                           subject=self.subject)

        self.task_number_extra = TaskNumberInExam.objects.create(name="10", check_rule="default", max_score=1,
                                                                 subject=self.subject)

    def test_filter_list(self):
        url = "/api/v1/filter/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("exams", response.data)

        exams = response.data["exams"]
        self.assertTrue(len(exams) > 0)
        subject = exams[0]["subjects"][0]
        self.assertIn("numbers", subject)

        numbers = subject["numbers"]
        self.assertEqual(numbers[0]["name"], "3")
        self.assertEqual(numbers[1]["name"], "10")

    def test_get_numbers(self):
        url = "/api/v1/filter/get_numbers/"
        post_data = {
            "subjectSlug": self.subject.slug,
            "examSlug": self.exam.slug
        }
        response = self.client.post(url, post_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("numbers", response.data)
        self.assertEqual(len(response.data["numbers"]), 2)
