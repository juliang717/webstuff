"""dateTime admin model registration"""

from django.contrib import admin
from .models import CurrDate, ChecklistComplete

# Register your models here.

admin.site.register(CurrDate)
admin.site.register(ChecklistComplete)
