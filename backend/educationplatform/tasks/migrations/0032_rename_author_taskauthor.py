# Generated by Django 4.2.1 on 2025-02-07 12:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0031_author_link'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Author',
            new_name='TaskAuthor',
        ),
    ]
