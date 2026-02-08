from rest_framework import viewsets, filters
from rest_framework.exceptions import ValidationError
from .models import Event, Instructor, Category
from .serializers import EventSerializer, InstructorSerializer, CategorySerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-start_datetime')
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'location']

    def perform_create(self, serializer):
        # بررسی اینکه کاربر حتما سازمان داشته باشد
        if not self.request.user.organization:
            raise ValidationError({"detail": "حساب کاربری شما به هیچ سازمانی متصل نیست. لطفاً ابتدا از طریق پنل ادمین جنگو، برای خود یک سازمان انتخاب کنید."})
        serializer.save(organization=self.request.user.organization)

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

    def perform_create(self, serializer):
        # اتصال خودکار استاد به سازمانِ کاربر جاری
        if not self.request.user.organization:
            raise ValidationError({"detail": "حساب کاربری شما به هیچ سازمانی متصل نیست. لطفاً ابتدا از طریق پنل ادمین جنگو، برای خود یک سازمان انتخاب کنید."})
        serializer.save(organization=self.request.user.organization)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def perform_create(self, serializer):
        if not self.request.user.organization:
            raise ValidationError({"detail": "کاربر بدون سازمان است."})
        serializer.save(organization=self.request.user.organization)