# Generated by Django 5.1.6 on 2025-04-01 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0051_tasknumberinexam_answer_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='extra_data',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
