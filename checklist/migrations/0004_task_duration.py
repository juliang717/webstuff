# Generated by Django 3.0.1 on 2020-01-15 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checklist', '0003_auto_20200115_0414'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='duration',
            field=models.IntegerField(default=-1),
        ),
    ]
