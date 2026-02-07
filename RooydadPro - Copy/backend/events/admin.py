from django.contrib import admin
from .models import Event, Instructor, Category

admin.site.register(Event)
admin.site.register(Instructor)
admin.site.register(Category)