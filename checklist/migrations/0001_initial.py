# Generated by Django 3.0.1 on 2020-01-07 06:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Counter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=300)),
                ('nextId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=300)),
                ('done', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=300)),
                ('done', models.BooleanField(default=False)),
                ('frequency', models.IntegerField(default=1)),
                ('weekday', models.CharField(default='none', max_length=300)),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='checklist.Section')),
            ],
        ),
    ]
