from django_filters import rest_framework as filters
from .models import Student, Sport


class StudentFilter(filters.FilterSet):
    sports = filters.ModelMultipleChoiceFilter(
        field_name='sport',
        queryset=Sport.objects.all(),
        conjoined=False
    )

    class Meta:
        model = Student
        fields = ['age', 'degree', 'faculty', 'sports__name']
        exclude = ('date',)

