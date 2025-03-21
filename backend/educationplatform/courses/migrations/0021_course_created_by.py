# Generated by Django 4.2.1 on 2025-02-10 09:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0020_sectionsolve_time_create_sectionsolve_time_update'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='created_by',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.PROTECT, related_name='created_courses', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
