from rest_framework import serializers

from .models import Student, Sport, Faculty, RegularPerson


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name']

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['id', 'name']


class StudentSerializerGET(serializers.ModelSerializer):
    faculty = serializers.CharField(source='faculty.name')
    sports = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True,
        many=True
    )
    class Meta:
        model = Student
        # fields = ['id', 'name1', 'name2', 'name3', 'age', 'phone', 'telegram', 'degree', 'faculty', 'sports', 'date']
        exclude = ('date',)

class StudentSerializerPOST(serializers.ModelSerializer):
    session_id = serializers.UUIDField(read_only=True)
    sports = serializers.PrimaryKeyRelatedField(
        queryset=Sport.objects.all(),
        many=True
    )

    class Meta:
        model = Student
        exclude = ('date',)



class RegularPersonGET(serializers.ModelSerializer):
    sports = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True,
        many=True
    )

    class Meta:
        model = RegularPerson
        exclude = ('date',)

class RegularPersonPOST(serializers.ModelSerializer):
    session_id = serializers.UUIDField(read_only=True)
    sports = serializers.PrimaryKeyRelatedField(
        queryset=Sport.objects.all(),
        many=True
    )

    class Meta:
        model = RegularPerson
        exclude = ('date',)

class SessionInfoSerializer(serializers.Serializer):
    students = StudentSerializerGET(many=True)
    regular_persons = RegularPersonGET(many=True)


