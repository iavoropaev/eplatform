# Generated by Django 4.2.1 on 2025-01-19 11:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='modules',
        ),
    ]
