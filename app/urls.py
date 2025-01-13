from django.urls import path
from .views import (
    SportListCreateAPIView,
    FacultyListCreateAPIView,
    StudentFormListAPIView,
    RegularPersonFormListAPIView,
    SessionInfoView,
)

urlpatterns = [
    path('v1/sports/', SportListCreateAPIView.as_view(), name='sport-list-create'),
    path('v1/faculties/', FacultyListCreateAPIView.as_view(), name='faculty-list-create'),
    path('v1/students/', StudentFormListAPIView.as_view(), name='student-list-create'),
    path('v1/regular_persons/', RegularPersonFormListAPIView.as_view(), name='regular-person-list-create'),
    path('v1/session-info/', SessionInfoView.as_view(), name='session-info'),
]
