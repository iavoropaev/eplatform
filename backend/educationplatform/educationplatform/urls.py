"""
URL configuration for educationplatform project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

from classes.views import ClassesViewSet
from courses.views import CoursesViewSet, EditCourseViewSet
from taskcollections.views import TaskCollectionViewSet, TaskCollectionSolveViewSet
from tasks.views import TaskViewSet, upload_file, TaskInfoViewSet, FilterForTaskViewSet, NumbersViewSet, \
    TaskSolutionsViewSet

router = routers.SimpleRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'filter', FilterForTaskViewSet)
router.register(r'tasks-info', TaskInfoViewSet, basename='task-info')
router.register(r'task-numbers', NumbersViewSet, basename='task-numbers')

router.register(r'tasks-solutions', TaskSolutionsViewSet)
router.register(r'tasks-collections', TaskCollectionViewSet)
router.register(r'tasks-collections-solve', TaskCollectionSolveViewSet)

router.register(r'courses', CoursesViewSet)
router.register(r'edit-course', EditCourseViewSet, basename='edit-course')

router.register(r'class', ClassesViewSet)

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/v1/', include(router.urls)),

                  path('api/v1/users/', include('users.urls')),
                  path('api/v1/tasks-info/', include('tasks.urls')),


                  path('api/v1/upload-file/', upload_file),

                  path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
                  path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
