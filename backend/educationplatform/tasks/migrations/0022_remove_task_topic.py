# Generated by Django 4.2.1 on 2024-12-21 08:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0021_actuality_task_created_by_task_is_public_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='topic',
        ),
    ]
