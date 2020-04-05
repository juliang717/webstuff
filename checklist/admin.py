"""TaskPal registered admin models"""

from django.contrib import admin
from .models import Task, Section, Counter

# Register your models here.
admin.site.register(Section)
admin.site.register(Task)
admin.site.register(Counter)
