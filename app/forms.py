from django import forms
from .models import Student, RegularPerson, Sport, Faculty
from django.core.exceptions import ValidationError
import re

class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['name1', 'name2', 'name3', 'age', 'degree', 'faculty', 'sports', 'phone', 'telegram']
        widgets = {
            'sports': forms.CheckboxSelectMultiple(),
            'age': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if not re.match(r'^\+998\d{9}$', phone):
            raise ValidationError("Телефон raqam +998XXXXXXXXX formatida bo'lishi kerak.")
        return phone


class RegularPersonForm(forms.ModelForm):
    class Meta:
        model = RegularPerson
        fields = ['name1', 'name2', 'name3', 'age', 'home', 'sports', 'phone', 'telegram']
        widgets = {
            'sports': forms.CheckboxSelectMultiple(),
            'age': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if not re.match(r'^\+998\d{9}$', phone):
            raise ValidationError("Телефон raqam +998XXXXXXXXX formatida bo'lishi kerak.")
        return phone
