# Generated by Django 5.1.6 on 2025-03-02 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskcollections', '0007_taskcollectionsolve_test_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskcollectionsolve',
            name='is_exam',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
