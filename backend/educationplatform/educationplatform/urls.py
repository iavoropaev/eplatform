import debug_toolbar
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
from users.views import AchievementViewSet

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

router.register(r'achievements', AchievementViewSet, basename='achievements')

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/v1/', include(router.urls)),

                  path('api/v1/users/', include('users.urls')),
                  path('api/v1/tasks-info/', include('tasks.urls')),


                  path('api/v1/upload-file/', upload_file),

                  path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
                  path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
