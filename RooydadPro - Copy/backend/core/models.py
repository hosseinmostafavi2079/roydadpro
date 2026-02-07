from django.db import models
from django.contrib.auth.models import AbstractUser

class Organization(models.Model):
    """
    هر رکوردی در این جدول، تنظیمات یک مجموعه یا شرکت مجزا است.
    """
    name = models.CharField(max_length=255, verbose_name="نام سازمان")
    slug = models.SlugField(unique=True, verbose_name="شناسه یکتا در URL")
    logo = models.ImageField(upload_to='org_logos/', null=True, blank=True, verbose_name="لوگو")
    
    # تم‌های رنگی مطابق با UI درخواستی
    THEME_COLORS = [
        ('indigo', 'نیلی (پیش‌فرض)'),
        ('emerald', 'زمردی'),
        ('rose', 'رز'),
        ('amber', 'کهربایی'),
        ('blue', 'آبی آسمانی'),
    ]
    theme_color = models.CharField(max_length=20, choices=THEME_COLORS, default='indigo', verbose_name="رنگ سازمانی")
    font_family = models.CharField(max_length=50, default='Vazirmatn RD', verbose_name="فونت سازمانی")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    """
    کاربر سیستم که به یک سازمان متصل می‌شود.
    """
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, related_name='users', verbose_name="سازمان")
    phone = models.CharField(max_length=15, unique=True, verbose_name="شماره موبایل")
    is_organizer = models.BooleanField(default=False, verbose_name="آیا برگزارکننده است؟")

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"