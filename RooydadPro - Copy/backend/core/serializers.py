from rest_framework import serializers
from .models import User, Organization

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'logo', 'theme_color', 'font_family']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'phone', 'email', 'is_organizer', 'organization']
        ref_name = 'CoreUserSerializer' # برای جلوگیری از تداخل نام