"""TaskPal backend database models"""

from django.db import models
# Create your models here.


class Counter(models.Model):
    """Keeps track of next id for each numerated model"""

    name = models.CharField(max_length=300)
    next_id = models.IntegerField()

    def __str__(self):
        return self.name + ": " + str(self.next_id)


class Section(models.Model):
    """Section of a checklist:
        id used to keep track of section order"""

    id = models.IntegerField(
        primary_key=True, editable=True)
    name = models.CharField(max_length=300)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Task(models.Model):
    """Task of a checklist:
        id used to keep track of task order"""

    id = models.IntegerField(primary_key=True, editable=True)
    name = models.CharField(max_length=300)
    done = models.BooleanField(default=False)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)

    frequency = models.IntegerField(default=1)
    duration = models.IntegerField(default=-1)

    monday = models.BooleanField(default=True)
    tuesday = models.BooleanField(default=True)
    wednesday = models.BooleanField(default=True)
    thursday = models.BooleanField(default=True)
    friday = models.BooleanField(default=True)
    saturday = models.BooleanField(default=True)
    sunday = models.BooleanField(default=True)

    def __str__(self):
        return self.name
