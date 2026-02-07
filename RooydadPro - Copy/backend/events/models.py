from django.db import models
from core.models import Organization

class Instructor(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, verbose_name="نام استاد")
    expertise = models.CharField(max_length=255, verbose_name="تخصص")
    bio = models.TextField(verbose_name="بیوگرافی و رزومه")
    image = models.ImageField(upload_to='instructors/', null=True, blank=True, verbose_name="تصویر")
    courses_count = models.PositiveIntegerField(default=0, verbose_name="تعداد دوره‌ها")
    
    def __str__(self):
        return self.name

class Category(models.Model):
    title = models.CharField(max_length=100, verbose_name="عنوان دسته‌بندی")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title

class Event(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name="عنوان رویداد")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, verbose_name="دسته‌بندی")
    instructor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="مدرس")
    
    # تاریخ و ساعت دقیق برای منطق سیستم
    start_datetime = models.DateTimeField(verbose_name="تاریخ و ساعت شروع دقیق")
    
    # رشته‌های متنی برای نمایش دقیق مثل دیزاین (مثلاً: ۲۵ اردیبهشت)
    date_display = models.CharField(max_length=50, verbose_name="متن تاریخ (نمایشی)")
    time_display = models.CharField(max_length=50, verbose_name="متن ساعت (نمایشی)")
    
    # تنظیمات برگزاری
    is_virtual = models.BooleanField(default=False, verbose_name="آیا مجازی است؟")
    location = models.CharField(max_length=255, blank=True, null=True, verbose_name="مکان برگزاری / پلتفرم")
    meeting_link = models.URLField(blank=True, null=True, verbose_name="لینک جلسه (فقط مجازی)")
    
    # مالی و ظرفیت
    price = models.DecimalField(max_digits=12, decimal_places=0, default=0, verbose_name="قیمت (تومان)")
    capacity = models.PositiveIntegerField(default=100, verbose_name="ظرفیت کل")
    registered_count = models.PositiveIntegerField(default=0, verbose_name="تعداد ثبت‌نامی")
    
    image = models.ImageField(upload_to='events/', null=True, blank=True, verbose_name="تصویر بنر")
    description = models.TextField(verbose_name="توضیحات تکمیلی")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title