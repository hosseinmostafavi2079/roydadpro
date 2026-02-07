from rest_framework import viewsets, filters
from .models import Event, Instructor, Category
from .serializers import EventSerializer, InstructorSerializer, CategorySerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-start_datetime')
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'location'] # قابلیت جستجو

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer