from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer
import uuid

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-purchase_date')
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated] # فقط کاربران لاگین شده می‌توانند بلیت بخرند

    def perform_create(self, serializer):
        # این تابع به صورت خودکار کاربر فعلی را به عنوان خریدار ثبت می‌کند
        # و یک کد رهگیری تصادفی تولید می‌کند
        serializer.save(
            user=self.request.user,
            ticket_code=str(uuid.uuid4())[:8].upper()
        )