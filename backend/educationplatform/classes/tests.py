from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase

from classes.models import Class, Invitation, Message


class ClassesViewSetTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.teacher = User.objects.create_user(username="teacher", password="pwd")
        self.student = User.objects.create_user(username="student", password="pwd")

        self.cls = Class.objects.create(
            created_by=self.teacher,
            name="7 Б"
        )
        self.cls.students.add(self.student)

        self.invitation = Invitation.objects.create(
            inv_class=self.cls
        )

        self.message = Message.objects.create(
            content="...",
            mes_class=self.cls
        )

    def test_get_class_data_teacher(self):
        url = "/api/v1/class/get-class-data/"
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(url, data={"class_id": self.cls.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["id"], self.cls.id)
        self.assertEqual(data["name"], self.cls.name)
        self.assertIn("students", data)
        self.assertIn("invitations", data)
        self.assertIn("messages", data)

    def test_get_class_data_forbidden_for_non_author(self):
        url = "/api/v1/class/get-class-data/"
        self.client.force_authenticate(user=self.student)
        response = self.client.get(url, data={"class_id": self.cls.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_my_classes(self):
        url = "/api/v1/class/get-my-classes/"
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.cls.id)

    def test_get_student_classes(self):
        url = "/api/v1/class/get-student-classes/"
        self.client.force_authenticate(user=self.student)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.cls.id)

    def test_get_student_messages(self):
        url = "/api/v1/class/get-student-messages/"
        self.client.force_authenticate(user=self.student)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertGreaterEqual(len(response.data), 1)
        message_data = response.data[0]
        self.assertIn("id", message_data)
        self.assertIn("content", message_data)
        self.assertIn("mes_class", message_data)

    def test_create_class(self):
        url = "/api/v1/class/create-class/"
        self.client.force_authenticate(user=self.teacher)
        payload = {
            "name": "11 А"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["name"], payload["name"])

    def test_delete_class(self):
        url = "/api/v1/class/delete-class/"
        self.client.force_authenticate(user=self.teacher)
        payload = {"class_id": self.cls.id}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'deleted'})

        with self.assertRaises(Class.DoesNotExist):
            Class.objects.get(id=self.cls.id)

    def test_exclude_user_from_class(self):
        url = "/api/v1/class/exclude-user-from-class/"

        self.client.force_authenticate(user=self.student)
        payload = {
            "class_id": self.cls.id,
            "excluded_user_id": self.student.id
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'Excluded'})
        self.assertFalse(self.cls.students.filter(id=self.student.id).exists())

    def test_create_invitation(self):
        url = "/api/v1/class/create-invitation/"
        self.client.force_authenticate(user=self.teacher)
        payload = {"class_id": self.cls.id}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("token", data)
        self.assertEqual(data["inv_class"], self.cls.id)

    def test_delete_invitation(self):
        url = "/api/v1/class/delete-invitation/"
        self.client.force_authenticate(user=self.teacher)
        payload = {"invitation_id": self.invitation.id}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'ok'})

        with self.assertRaises(Invitation.DoesNotExist):
            Invitation.objects.get(id=self.invitation.id)

    def test_activate_invitation(self):
        url = "/api/v1/class/activate-invitation/"
        self.client.force_authenticate(user=self.student)
        payload = {"token": str(self.invitation.token)}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_message(self):
        url = "/api/v1/class/create-message/"
        self.client.force_authenticate(user=self.teacher)
        payload = {
            "class_id": self.cls.id,
            "content": "..."
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertIn("id", data)
        self.assertEqual(data["content"], payload["content"])

    def test_delete_message(self):
        url = "/api/v1/class/delete-message/"
        self.client.force_authenticate(user=self.teacher)
        payload = {"message_id": self.message.id}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'deleted'})
        with self.assertRaises(Message.DoesNotExist):
            Message.objects.get(id=self.message.id)
