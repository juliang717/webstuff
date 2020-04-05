"""date_time models"""

from django.db import models

# Create your models here.


class CurrDate(models.Model):
    """holds current database date"""

    name = models.CharField(primary_key=True, max_length=300)
    date = models.DateField()

    def __str__(self):
        return self.name


class ChecklistComplete(models.Model):
    """holds a date on which the checklist was completed"""

    date = models.DateField(primary_key=True)

    def __str__(self):
        return str(self.date)
