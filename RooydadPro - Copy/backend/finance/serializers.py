from rest_framework import serializers
from .models import Ticket
from events.serializers import EventSerializer

class TicketSerializer(serializers.ModelSerializer):
    event_details = EventSerializer(source='event', read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'user', 'event', 'event_details', 'ticket_code', 'status', 'price_paid', 'purchase_date', 'is_present']
        # تغییر مهم: اضافه کردن 'user' به لیست فیلدهای فقط خواندنی
        read_only_fields = ['ticket_code', 'purchase_date', 'user']