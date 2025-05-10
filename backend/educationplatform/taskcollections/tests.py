import json
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase

from tasks.models import Task, TaskSubject, TaskExam, TaskNumberInExam, TaskAuthor, TaskSource, DifficultyLevel, \
    Actuality

from taskcollections.models import TaskCollection, TaskCollectionTask, TaskCollectionSolve


class TestTaskCollectionViewSet(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="testuser", password="pwd")
        self.admin = User.objects.create_superuser(username="admin", password="pwd", email="admin@example.com")

        self.exam = TaskExam.objects.create(name="Экзамен", slug="exam")
        self.subject = TaskSubject.objects.create(name="Математика", slug="math", exam=self.exam)
        self.difficulty = DifficultyLevel.objects.create(name="Лёгкий", exam=self.exam)
        self.actuality = Actuality.objects.create(name="Актуальная", priority=1)
        self.author = TaskAuthor.objects.create(name="Автор 1", link="http://example.com")
        self.source = TaskSource.objects.create(name="Источник 1")
        self.task_number = TaskNumberInExam.objects.create(
            name="1", check_rule="default", max_score=1, subject=self.subject
        )
        self.subject.difficulty_levels.add(self.difficulty)
        self.subject.authors.add(self.author)

        self.task = Task.objects.create(
            created_by=self.user,
            content="1+1 = ",
            answer_type="text",
            answer=json.dumps("68"),
            solution="Решение",
            number_in_exam=self.task_number,
            author=self.author,
            source=self.source,
            difficulty_level=self.difficulty,
            actuality=self.actuality
        )

        self.collection = TaskCollection.objects.create(
            name="Коллекция 1",
            slug="collection-1",
            subject=self.subject,
            is_exam=True,
            description="Описание коллекции",
            is_public=True,
            created_by=self.user
        )
        TaskCollectionTask.objects.create(
            task_collection=self.collection,
            task=self.task,
            order=0
        )

    def test_retrieve_collection_with_tasks(self):
        url = f"/api/v1/tasks-collections/{self.collection.slug}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("id", data)
        self.assertEqual(data["slug"], self.collection.slug)

        self.assertIn("tasks", data)
        self.assertIsInstance(data["tasks"], list)
        self.assertGreaterEqual(len(data["tasks"]), 1)

        task_data = data["tasks"][0]
        self.assertEqual(task_data["id"], self.task.id)
        self.assertEqual(task_data["content"], self.task.content)

    def test_create_collection_endpoint(self):
        url = "/api/v1/tasks-collections/create-collection/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "name": "Новая коллекция",
            "slug": "new-collection",
            "subject": self.subject.id,
            "is_exam": False,
            "description": "Описание..."
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertEqual(data["name"], payload["name"])
        self.assertEqual(data["slug"], payload["slug"])
        self.assertEqual(data["subject"], self.subject.id)

    def test_my_collections_endpoint(self):
        url = "/api/v1/tasks-collections/my-collections/"
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
        self.assertEqual(data[0]["slug"], self.collection.slug)

    def test_update_collection_endpoint(self):
        url = "/api/v1/tasks-collections/update-collection/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "id": self.collection.id,
            "name": "Обновлённная коллекция",
            "tasks": [
                {"id": self.task.id}
            ]
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertEqual(data["name"], "Обновлённная коллекция")
        self.assertIn("tasks", data)
        self.assertEqual(len(data["tasks"]), 1)
        self.assertEqual(data["tasks"][0]["id"], self.task.id)

    def test_generate_collection_endpoint(self):
        url = "/api/v1/tasks-collections/generate-collection/"
        self.client.force_authenticate(user=self.user)

        payload = {
            "name": "Сгенерированная подборка",
            "slug": "generated-collection",
            "description": "Описание...",
            "subject": self.subject.id,
            "generateParams": [
                {
                    "count": 2,
                    "number": {"id": self.task_number.id, "name": self.task_number.name},
                    "difficulty": "-",
                    "author": "-",
                    "actuality": "-"
                }
            ]
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertEqual(data["slug"], "generated-collection")

    def test_delete_collection_endpoint(self):
        url = "/api/v1/tasks-collections/delete-collection/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "collection_id": self.collection.id
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'deleted'})
        with self.assertRaises(TaskCollection.DoesNotExist):
            TaskCollection.objects.get(id=self.collection.id)


class TestTaskCollectionSolveViewSet(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="ivan", password="pwd")
        self.admin = User.objects.create_superuser(username="admin", password="pwd", email="admin@com")

        self.exam = TaskExam.objects.create(name="Экзамен", slug="exam")
        self.subject = TaskSubject.objects.create(name="Физика", slug="physics", exam=self.exam)
        self.difficulty = DifficultyLevel.objects.create(name="Средний", exam=self.exam)
        self.actuality = Actuality.objects.create(name="Актуально", priority=2)
        self.author = TaskAuthor.objects.create(name="Автор", link="...")
        self.source = TaskSource.objects.create(name="Источник")
        self.task_number = TaskNumberInExam.objects.create(
            name="2", check_rule="default", max_score=2, subject=self.subject
        )
        self.subject.difficulty_levels.add(self.difficulty)
        self.subject.authors.add(self.author)

        self.task = Task.objects.create(
            created_by=self.user,
            content="Задача для решения коллекции",
            answer_type="text",
            answer=json.dumps("123"),
            solution="Правильное решение",
            number_in_exam=self.task_number,
            author=self.author,
            source=self.source,
            difficulty_level=self.difficulty,
            actuality=self.actuality
        )

        self.collection = TaskCollection.objects.create(
            name="Коллекция",
            slug="collection",
            subject=self.subject,
            is_exam=True,
            description="Описание",
            is_public=True,
            created_by=self.user
        )
        TaskCollectionTask.objects.create(
            task_collection=self.collection,
            task=self.task,
            order=0
        )

    def test_send_solution(self):
        url = "/api/v1/tasks-collections-solve/send-solution/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "col_slug": self.collection.slug,
            "answers": {},
            "duration": 68
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("solution", data)
        sol = data["solution"]
        self.assertLessEqual(sol["score"], sol["max_score"])

    def test_get_solution_by_type(self):
        for i in range(2):
            TaskCollectionSolve.objects.create(
                task_collection=self.collection,
                user=self.user,
                answers=[],
                score=2,
                max_score=2,
                test_score=100,
                duration=100 + i * 10
            )
        url = "/api/v1/tasks-collections-solve/get-solution/"
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, data={"col_slug": self.collection.slug, "sol_type": "last"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("id", data)
        self.assertEqual(data.get("exam"), self.collection.subject.exam.name)

    def test_get_my_solutions_endpoint(self):
        for i in range(3):
            TaskCollectionSolve.objects.create(
                task_collection=self.collection,
                user=self.user,
                answers=[],
                score=2,
                max_score=2,
                test_score=100,
                duration=100 + i * 10
            )
        url = "/api/v1/tasks-collections-solve/get-my-solutions/"
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        sols = response.data
        self.assertIsInstance(sols, list)
        self.assertEqual(len(sols), 3)

    def test_delete_solution_endpoint(self):
        solve = TaskCollectionSolve.objects.create(
            task_collection=self.collection,
            user=self.user,
            answers=[],
            score=2,
            max_score=2,
            test_score=100,
            duration=120
        )
        url = "/api/v1/tasks-collections-solve/delete-solution/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "solution_id": solve.id
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'deleted'})

        with self.assertRaises(TaskCollectionSolve.DoesNotExist):
            TaskCollectionSolve.objects.get(id=solve.id)
