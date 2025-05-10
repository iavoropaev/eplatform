from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase

from courses.models import (
    Course, Module, Lesson, Section,
    CourseModule, ModuleLesson, LessonSection
)

from tasks.models import TaskSubject, TaskExam


class CoursesViewSetTests(APITestCase):
    def setUp(self):
        User = get_user_model()

        self.user = User.objects.create_user(username="user", password="pwd")
        self.admin = User.objects.create_superuser(username="admin", password="pwd", email="admin@com")
        self.exam = TaskExam.objects.create(name="огэ", slug="oge")
        self.subject = TaskSubject.objects.create(name="Математика", slug="math", exam=self.exam)

        self.course = Course.objects.create(
            created_by=self.user,
            name="Курс 1",
            description="Описание курса",
            subject=self.subject,
            is_public=True
        )

        self.module = Module.objects.create(
            created_by=self.user,
            name="Модуль 1",
            description="Описание модуля"
        )
        CourseModule.objects.create(course=self.course, module=self.module, order=0)

        self.lesson = Lesson.objects.create(
            created_by=self.user,
            name="Урок 1"
        )
        ModuleLesson.objects.create(module=self.module, lesson=self.lesson, order=0)

        self.section = Section.objects.create(
            created_by=self.user,
            type="text",
            content="Контент...",
            video=""
        )
        LessonSection.objects.create(lesson=self.lesson, section=self.section, order=0)

    def test_all_courses(self):
        url = "/api/v1/courses/all/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("courses", response.data)
        self.assertGreaterEqual(len(response.data["courses"]), 1)

    def test_my_courses(self):
        url = "/api/v1/courses/my-courses/"
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_courses_by_subject(self):
        url = "/api/v1/courses/get-courses-by-subject/"
        params = {"subject_slug": self.subject.slug}
        response = self.client.get(url, data=params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for course in response.data:
            self.assertIn("name", course)
            self.assertIn("description", course)

    def test_course_data(self):
        url = f"/api/v1/courses/{self.course.id}/data/"
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["id"], self.course.id)
        self.assertTrue(data.get("is_author"))

    def test_get_lesson(self):
        url = "/api/v1/courses/get-lesson/"
        self.client.force_authenticate(user=self.user)
        params = {"lesson_id": self.lesson.id}
        response = self.client.get(url, data=params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(int(response.data.get("id", self.lesson.id)), self.lesson.id)

    def test_get_section(self):
        url = "/api/v1/courses/get-section/"
        self.client.force_authenticate(user=self.user)
        params = {"section_id": self.section.id}
        response = self.client.get(url, data=params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["id"], self.section.id)
        self.assertEqual(data["content"], self.section.content)

    def test_get_lesson_name(self):
        url = "/api/v1/courses/get-lesson-name/"
        self.client.force_authenticate(user=self.user)
        params = {"lesson_id": self.lesson.id}
        response = self.client.get(url, data=params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.lesson.id)
        self.assertEqual(response.data["name"], self.lesson.name)

    def test_get_module_with_lessons(self):
        url = "/api/v1/courses/get-module-with-lessons/"
        self.client.force_authenticate(user=self.user)
        params = {"module_id": self.module.id}
        response = self.client.get(url, data=params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["id"], self.module.id)
        self.assertIn("lessons", data)
        self.assertGreaterEqual(len(data["lessons"]), 1)

    def test_send_solution(self):
        url = "/api/v1/courses/send-solution/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "section_id": self.section.id,
            "user_answer": "Любой текст"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data.get("solve_status"), "OK")
        self.assertEqual(data.get("score"), 1)


class EditCourseViewSetTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="u3", password="pwd")
        self.admin = User.objects.create_superuser(username="admin", password="pwd", email="admin@example.com")
        self.exam = TaskExam.objects.create(name="егэ", slug="ege")
        self.subject = TaskSubject.objects.create(name="Физика", slug="physics", exam=self.exam)
        self.course = Course.objects.create(
            created_by=self.user,
            name="Курс",
            description="Описание",
            subject=self.subject,
            is_public=True
        )
        self.module = Module.objects.create(
            created_by=self.user,
            name="Модуль",
            description="Описание"
        )
        CourseModule.objects.create(course=self.course, module=self.module, order=0)
        self.lesson = Lesson.objects.create(
            created_by=self.user,
            name="Урок"
        )
        ModuleLesson.objects.create(module=self.module, lesson=self.lesson, order=0)
        self.section = Section.objects.create(
            created_by=self.user,
            type="text",
            content="Первоначальный контент",
            video=""
        )
        LessonSection.objects.create(lesson=self.lesson, section=self.section, order=0)

    def test_create_course(self):
        url = "/api/v1/edit-course/create-course/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "name": "Новый курс",
            "description": "Описание",
            "subject": self.subject.id
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertEqual(data["name"], payload["name"])
        self.assertEqual(data["subject"], self.subject.id)

    def test_create_module(self):
        url = "/api/v1/edit-course/create-module/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "name": "Новый модуль",
            "description": "Описание"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertEqual(data["name"], payload["name"])

    def test_create_lesson(self):
        url = "/api/v1/edit-course/create-lesson/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "name": "Новый урок"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], payload["name"])

    def test_create_section(self):
        url = "/api/v1/edit-course/create-section/"
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertIn(data["type"], ["task", "text"])

    def test_update_lesson(self):
        url = "/api/v1/edit-course/update-lesson/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "id": self.lesson.id,
            "name": "Урок обновленный",
            "sections": [
                {
                    "id": self.section.id,
                    "content": "Обновленный контент",
                    "task": None,
                    "type": "text"
                }
            ]
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        lesson_data = response.data
        self.assertEqual(lesson_data.get("name"), "Урок обновленный")
        sections = lesson_data.get("sections", [])
        self.assertGreaterEqual(len(sections), 1)
        self.assertEqual(sections[0]["content"], "Обновленный контент")

    def test_update_course(self):
        url = "/api/v1/edit-course/update/"
        self.client.force_authenticate(user=self.user)
        payload = {
            "id": self.course.id,
            "name": "Курс обновленный",
            "description": "Новое описание курса",
            "modules": [
                {
                    "id": self.module.id,
                    "name": "Модуль обновленный",
                    "lessons": [
                        {
                            "id": self.lesson.id
                        }
                    ]
                }
            ]
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        course_data = response.data
        self.assertEqual(course_data["name"], "Курс обновленный")

    def test_delete_course(self):
        url = "/api/v1/edit-course/delete-course/"
        self.client.force_authenticate(user=self.user)
        payload = {"course_id": self.course.id}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'deleted'})
        with self.assertRaises(Course.DoesNotExist):
            Course.objects.get(id=self.course.id)
