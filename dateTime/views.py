"""dateTime views"""

import json
import datetime
from django.http import HttpResponse
from .models import CurrDate
# from django.shortcuts import render

# Create your views here.


def get_curr_date(request):
    """Returns current date"""

    today_dt = datetime.datetime.now(datetime.timezone(
        datetime.timedelta(0, 0, 0, 0, 0, -8)))

    today = datetime.date(today_dt.year, today_dt.month, today_dt.day)

    curr_date_obj = {"day": today.day,
                     "month": today.month,
                     "year": today.year,
                     "weekday": today.weekday()}

    return HttpResponse(json.dumps(curr_date_obj))


def get_cl_date(request):
    """Returns current checklist database date"""

    return HttpResponse(str(CurrDate.objects.get(pk="Checklist Date")))
