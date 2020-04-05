"TaskPal backend functionality"

# from django.template.defaulttags import csrf_token
# from django.shortcuts import render
import json
import datetime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from checklist.models import Task, Section, Counter
from dateTime.models import CurrDate, ChecklistComplete
from taskpal.util import byteToDict

# Create your views here.


def get_checklist(request):
    """Sends the current checklist to the frontend"""

    today_dt = datetime.datetime.now(datetime.timezone(
        datetime.timedelta(0, 0, 0, 0, 0, -10)))

    today = datetime.date(today_dt.year, today_dt.month, today_dt.day)

    print(today)

    def update_date():

        complete = True

        for section in sections:

            task_set = section.task_set.all()
            for task in task_set:
                if not task.done:
                    complete = False
                    break

        print(complete)

        if complete:
            complete_date = ChecklistComplete()
            complete_date.date = CurrDate.objects.get(pk="Checklist Date").date
            complete_date.save()

        for section in sections:
            task_set = section.task_set.all()
            for task in task_set:
                task.done = False
                task.save()

        cl_date = CurrDate.objects.get(pk="Checklist Date")
        cl_date.date = today
        cl_date.save()

    print(today.weekday())

    sections = Section.objects.all()

    if today != CurrDate.objects.get(pk="Checklist Date").date:
        update_date()

    all_sections = []

    for section in sections:

        task_set = section.task_set.all()

        curr_section = {
            "id": str(section.id),
            "name": section.name,
            "done": section.done,
            "tasks": []
        }
        for task in task_set:
            curr_task = {
                "id": str(task.id),
                "name": task.name,
                "done": task.done,
                "section": section.name,
                "monday": task.monday,
                "tuesday": task.tuesday,
                "wednesday": task.wednesday,
                "thursday": task.thursday,
                "friday": task.friday,
                "saturday": task.saturday,
                "sunday": task.sunday,
            }
            curr_section["tasks"].append(curr_task)
        all_sections.append(curr_section)

    return HttpResponse(json.dumps(all_sections))


@csrf_exempt
def update_checklist(request):
    """Receives current checklist from frontend,
     deletes DB checklist,
     creates new database checklist"""

    data = byteToDict(request.body)
    id_gen = Counter.objects.get(name="Checklist")

    Section.objects.all().delete()

    for section in data:

        new_sec = Section()

        new_sec.id = id_gen.next_id
        id_gen.next_id += 1
        id_gen.save()

        new_sec.name = section["name"]
        new_sec.done = section["done"]
        new_sec.save()

        for task in section["tasks"]:

            new_task = Task()

            new_task.id = id_gen.next_id
            id_gen.next_id += 1
            id_gen.save()

            new_task.name = task["name"]
            new_task.done = task["done"]
            new_task.section = new_sec

            new_task.monday = task["monday"]
            new_task.tuesday = task["tuesday"]
            new_task.wednesday = task["wednesday"]
            new_task.thursday = task["thursday"]
            new_task.friday = task["friday"]
            new_task.saturday = task["saturday"]
            new_task.sunday = task["sunday"]

            new_task.save()

    return HttpResponse(True)


@csrf_exempt
def complete_task(request):
    """Receives task id from frontend and sets task as completed"""

    data = byteToDict(request.body)

    task = Task.objects.get(pk=data["id"])
    task.done = True
    task.save()

    return HttpResponse(True)


def undo_checklist(request):
    """Resets checklist to undone"""
    sections = Section.objects.all()

    for section in sections:
        section.done = False
        section.save()
        task_set = section.task_set.all()
        for task in task_set:
            task.done = False
            task.save()

    return HttpResponse(True)


@csrf_exempt
def get_completion(request):
    """Receives month
    Returns array of all dates in the given month on which the checklist was completed"""

    data = byteToDict(request.body)
    days = []

    date_objs = ChecklistComplete.objects.all().filter(
        date__month=data["month"])

    for obj in date_objs:
        days.append(obj.date.day)

    return HttpResponse(json.dumps(days))
