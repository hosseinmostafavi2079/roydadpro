from rest_framework import serializers
from .models import Event, Instructor, Category
from core.serializers import OrganizationSerializer

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = ['id', 'name', 'expertise', 'bio', 'image', 'courses_count']
        # این خط باعث می‌شود فرانت‌اند نیازی به ارسال سازمان نداشته باشد
        read_only_fields = ['organization']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title']
        read_only_fields = ['organization']

class EventSerializer(serializers.ModelSerializer):
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
        read_only_fields = ['organization', 'registered_count']