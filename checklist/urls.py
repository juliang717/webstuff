"""Checklist urls"""

from django.urls import path
from checklist import views

urlpatterns = [
    path('get', views.get_checklist, name='get_checklist'),
    path('update', views.update_checklist, name='update_checklist'),
    path('undo', views.undo_checklist, name='undo_checklist'),
    path('complete_task', views.complete_task, name='complete_task'),
    path('get_completion', views.get_completion, name='get_completion'),
]
