from rest_framework.routers import DefaultRouter
from .views import EventViewSet, InstructorViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'instructors', InstructorViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = router.urls