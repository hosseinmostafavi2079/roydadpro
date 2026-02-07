from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Organization

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # اضافه کردن فیلدهای جدید به پنل یوزر
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات تکمیلی', {'fields': ('phone', 'organization', 'is_organizer')}),
    )
    list_display = ('username', 'phone', 'organization', 'is_organizer')

admin.site.register(Organization)