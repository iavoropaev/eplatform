# Generated by Django 4.2.1 on 2025-01-14 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskcollections', '0004_taskcollection_is_public'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskcollectionsolve',
            name='answers',
            field=models.JSONField(),
        ),
    ]