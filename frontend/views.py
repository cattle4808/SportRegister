from django.shortcuts import render
from django.views import View
from app.models import Faculty, Sport

class HomeView(View):
    def get(self, request):
        has_session = bool(request.session.get("session_id"))
        return render(request, 'frontend/home.html', {'has_session': has_session})

class CreateStudentView(View):
    def get(self, request):
        faculties = Faculty.objects.all()
        sports = Sport.objects.all()
        degrees = Faculty.Degree.choices
        return render(request, 'frontend/create_student.html', {
            'faculties': faculties,
            'sports': sports,
            'degrees': degrees,
        })

class RegularPersonView(View):
    def get(self, request):
        sports = Sport.objects.all()
        return render(request, 'frontend/regular_person.html', {
            'sports': sports,
        })

class ThankYouView(View):
    def get(self, request):
        return render(request, 'frontend/thank_you.html')
