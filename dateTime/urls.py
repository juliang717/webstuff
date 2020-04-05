"""dateTime urls"""

from django.urls import path
from dateTime import views

urlpatterns = [
    path('get_cl_date', views.get_cl_date, name='get_cl_date'),
    path('get_curr', views.get_curr_date, name='get_curr'),
]
