# Generated by Django 5.1.6 on 2025-03-31 12:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskcollections', '0013_alter_taskcollection_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskcollectionsolve',
            name='task_collection',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskcollections.taskcollection'),
        ),
    ]
