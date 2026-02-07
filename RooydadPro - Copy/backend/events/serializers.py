from rest_framework import serializers
from .models import Event, Instructor, Category
from core.serializers import OrganizationSerializer

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = ['id', 'name', 'expertise', 'bio', 'image', 'courses_count']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title']

class EventSerializer(serializers.ModelSerializer):
    # برای اینکه در پاسخ، اطلاعات کامل دسته‌بندی و استاد بیاید (نه فقط ID)
    category_details = CategorySerializer(source='category', read_only=True)
    instructor_details = InstructorSerializer(source='instructor', read_only=True)
    organization_details = OrganizationSerializer(source='organization', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'category', 'category_details', 
            'instructor', 'instructor_details', 
            'organization', 'organization_details',
            'start_datetime', 'date_display', 'time_display',
            'is_virtual', 'location', 'meeting_link',
            'price', 'capacity', 'registered_count',
            'image', 'description'
        ]