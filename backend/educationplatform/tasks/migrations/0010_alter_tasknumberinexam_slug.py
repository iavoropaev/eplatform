# Generated by Django 4.2.1 on 2024-12-05 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0009_tasksubject_difficulty_levels'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasknumberinexam',
            name='slug',
            field=models.SlugField(max_length=100),
        ),
    ]