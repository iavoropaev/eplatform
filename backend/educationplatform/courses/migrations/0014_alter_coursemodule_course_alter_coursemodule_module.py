# Generated by Django 4.2.1 on 2025-01-19 13:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0013_alter_modulelesson_module'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursemodule',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='coursemodules', to='courses.course'),
        ),
        migrations.AlterField(
            model_name='coursemodule',
            name='module',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='coursemodules', to='courses.module'),
        ),
    ]
