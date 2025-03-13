"""
from django.utils.html import format_html
from django.contrib import admin
from .models import Faculty, Sport, Student, RegularPerson

@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'degree')
    list_filter = ('degree',)
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Sport)
class SportAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'name1',
        'name2',
        'degree',
        'faculty',
        'age',
        'phone',
        'telegram',
        'display_sports',
        'date',
        'photo_small',
    )
    list_filter = ('degree', 'faculty', 'sports')
    search_fields = ('name1', 'name2', 'faculty__name', 'sports__name')
    ordering = ('name1', 'name2')
    filter_horizontal = ('sports',)

    def display_sports(self, obj):
        return ", ".join([sport.name for sport in obj.sports.all()])
    display_sports.short_description = 'Sport turlari'

    def photo_small(self, obj):
        if obj.photo:
            return format_html(
                "<img src='{}' style='width:80px; height:auto;'>",
                obj.photo.url
            )
        return "-"
    photo_small.short_description = "Rasm"

@admin.register(RegularPerson)
class RegularPersonAdmin(admin.ModelAdmin):
    list_display = (
        'name1',
        'name2',
        'home',
        'age',
        'phone',
        'telegram',
        'display_sports',
        'date',
        'photo_small',
    )
    search_fields = ('name1', 'name2', 'home', 'sports__name')
    ordering = ('name1', 'name2')
    filter_horizontal = ('sports',)

    def display_sports(self, obj):
        return ", ".join([sport.name for sport in obj.sports.all()])
    display_sports.short_description = 'Sport turlari'

    def photo_small(self, obj):
        if obj.photo:
            return format_html(
                "<a href='{url}' target='_blank'>"
                "<img src='{url}' style='width:80px; height:auto;' />"
                "</a>",
                url=obj.photo.url
            )
        return "-"
    photo_small.short_description = "Rasm"
"""

from django.utils.html import format_html
from django.contrib import admin
from django.db.models import Count
from django.utils.translation import gettext_lazy as _
from .models import Faculty, Sport, Student, RegularPerson, AcademyPerson

class UniqueFullNameFilter(admin.SimpleListFilter):
    title = _('Ism-familiya bo‘yicha filtr')
    parameter_name = 'unique_full_name'

    def lookups(self, request, model_admin):
        return [('yes', _('Yagonalari')), ('no', _('Barchasi'))]

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            unique_students = (
                queryset.values('name1', 'name2')
                .annotate(count=Count('id'))
                .filter(count=1)
            )
            return queryset.filter(
                name1__in=[student['name1'] for student in unique_students],
                name2__in=[student['name2'] for student in unique_students]
            )
        return queryset


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'degree')
    list_filter = ('degree',)
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Sport)
class SportAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'name1',
        'name2',
        'degree',
        'faculty',
        'age',
        'phone',
        'telegram',
        'display_sports',
        'date',
        'photo_small',
    )
    list_filter = ('degree', 'faculty', 'sports', UniqueFullNameFilter)  
    search_fields = ('name1', 'name2', 'faculty__name', 'sports__name')
    ordering = ('name1', 'name2')
    filter_horizontal = ('sports',)

    def display_sports(self, obj):
        return ", ".join([sport.name for sport in obj.sports.all()])
    display_sports.short_description = 'Sport turlari'

    def photo_small(self, obj):
        if obj.photo:
            return format_html(
                "<img src='{}' style='width:80px; height:auto;'>",
                obj.photo.url
            )
        return "-"
    photo_small.short_description = "Rasm"

@admin.register(RegularPerson)
class RegularPersonAdmin(admin.ModelAdmin):
    list_display = (
        'name1',
        'name2',
        'home',
        'age',
        'phone',
        'telegram',
        'display_sports',
        'date',
        'photo_small',
    )
    search_fields = ('name1', 'name2', 'home', 'sports__name')
    ordering = ('name1', 'name2')
    filter_horizontal = ('sports',)

    def display_sports(self, obj):
        return ", ".join([sport.name for sport in obj.sports.all()])
    display_sports.short_description = 'Sport turlari'

    def photo_small(self, obj):
        if obj.photo:
            return format_html(
                "<a href='{url}' target='_blank'>"
                "<img src='{url}' style='width:80px; height:auto;' />"
                "</a>",
                url=obj.photo.url
            )
        return "-"
    photo_small.short_description = "Rasm"

@admin.register(AcademyPerson)
class AcademyPersonAdmin(admin.ModelAdmin):
    list_display = (
        'name1',
        'name2',
        'job',
        'position',
        'date',
    )
    search_fields = ('name1', 'name2', 'job', 'position')
    ordering = ('name1', 'name2')
    filter_horizontal = ('sports',)
