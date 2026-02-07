from django.db import models
from core.models import User
from events.models import Event

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('paid', 'پرداخت شده'),
        ('pending', 'در انتظار پرداخت'),
        ('cancelled', 'لغو شده'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='tickets', verbose_name="کاربر")
    event = models.ForeignKey(Event, on_delete=models.PROTECT, related_name='tickets', verbose_name="رویداد")
    ticket_code = models.CharField(max_length=20, unique=True, verbose_name="کد رهگیری")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="وضعیت")
    price_paid = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="مبلغ پرداختی")
    purchase_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ خرید")
    
    is_present = models.BooleanField(default=False, verbose_name="وضعیت حضور")

    def __str__(self):
        return f"{self.ticket_code} - {self.user.username}"