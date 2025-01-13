from django.urls import path
from . import views

app_name = 'frontend'

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('create_student/', views.CreateStudentView.as_view(), name='create_student'),
    path('regular_person/', views.RegularPersonView.as_view(), name='regular_person'),
    path('thank_you/', views.ThankYouView.as_view(), name='thank_you'),
]
