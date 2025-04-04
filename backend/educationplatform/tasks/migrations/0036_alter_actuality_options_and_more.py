# Generated by Django 5.1.6 on 2025-03-27 13:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0035_tasknumberinexam_max_score'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='actuality',
            options={'verbose_name': 'Актуальность задачи', 'verbose_name_plural': 'Актуальности задач'},
        ),
        migrations.AlterModelOptions(
            name='difficultylevel',
            options={'verbose_name': 'Сложность задач', 'verbose_name_plural': 'Сложности задач'},
        ),
        migrations.AlterModelOptions(
            name='task',
            options={'verbose_name': 'Задача', 'verbose_name_plural': 'Задачи'},
        ),
        migrations.AlterModelOptions(
            name='taskauthor',
            options={'verbose_name': 'Автор задачи', 'verbose_name_plural': 'Авторы задач'},
        ),
        migrations.AlterModelOptions(
            name='taskbankauthor',
            options={'verbose_name': 'Автор банка задач', 'verbose_name_plural': 'Авторы банка задач'},
        ),
        migrations.AlterModelOptions(
            name='taskexam',
            options={'verbose_name': 'Экзамен', 'verbose_name_plural': 'Экзамены'},
        ),
        migrations.AlterModelOptions(
            name='tasknumberinexam',
            options={'verbose_name': 'Номер задач в экзамене', 'verbose_name_plural': 'Номера задач в экзамене'},
        ),
        migrations.AlterModelOptions(
            name='tasksolutions',
            options={'verbose_name': 'Решение задачи', 'verbose_name_plural': 'Решения задач'},
        ),
        migrations.AlterModelOptions(
            name='tasksource',
            options={'verbose_name': 'Источник задачи', 'verbose_name_plural': 'Источники задач'},
        ),
        migrations.AlterModelOptions(
            name='tasksubject',
            options={'verbose_name': 'Предмет', 'verbose_name_plural': 'Предметы'},
        ),
        migrations.AlterModelOptions(
            name='tasktopic',
            options={'verbose_name': 'Тема задачи', 'verbose_name_plural': 'Темы задач'},
        ),
        migrations.AlterModelOptions(
            name='uploadfiles',
            options={'verbose_name': 'Файл', 'verbose_name_plural': 'Файлы'},
        ),
    ]
