from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Achievement

admin.site.register(User, UserAdmin)
admin.site.register(Achievement)


admin.site.site_header = "PRO100 ЕГЭ"
admin.site.site_title = " "
admin.site.index_title = "Админ-панель"