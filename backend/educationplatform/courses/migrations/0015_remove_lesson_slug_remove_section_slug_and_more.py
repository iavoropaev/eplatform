# Generated by Django 4.2.1 on 2025-01-20 10:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0014_alter_coursemodule_course_alter_coursemodule_module'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='section',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='theorysection',
            name='slug',
        ),
    ]
