# Generated by Django 4.2.1 on 2024-12-05 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0011_alter_taskbankauthor_slug_alter_taskexam_slug_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasknumberinexam',
            name='slug',
            field=models.SlugField(max_length=100, null=True),
        ),
    ]