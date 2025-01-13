import uuid
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Sport, Faculty, Student, RegularPerson
from .serializers import (
    SportSerializer,
    FacultySerializer,
    StudentSerializerGET,
    StudentSerializerPOST,
    RegularPersonGET,
    RegularPersonPOST,
    SessionInfoSerializer
)


class SportListCreateAPIView(ListCreateAPIView):
    """
    Представление для создания и просмотра списка видов спорта (Sport).

    Доступно только администраторам:
    - GET /sports/ — получить список всех видов спорта (с фильтрацией и поиском).
    - POST /sports/ — добавить новый вид спорта.
    """
    queryset = Sport.objects.all()
    serializer_class = SportSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name']
    filterset_fields = ['name']

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return [AllowAny()]


class FacultyListCreateAPIView(ListCreateAPIView):
    """
    Представление для создания и просмотра списка факультетов (Faculty).

    Доступно только администраторам:
    - GET /faculties/ — получить список всех факультетов (с фильтрацией и поиском).
    - POST /faculties/ — добавить новый факультет.
    """
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name']
    filterset_fields = ['degree']

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return [AllowAny()]



class StudentFormListAPIView(ListCreateAPIView):
    """
    Представление для обычных пользователей, которые могут создавать
    и просматривать список собственных объектов Student,
    «привязанных» к текущей session_id в Cookies.

    - GET /students/ — получить список своих Student-записей (для текущей сессии).
    - POST /students/ — создать новую Student-запись.
      Если session_id не существует в сессии, он автоматически генерируется.
    """
    queryset = Student.objects.all()

    def get_serializer_class(self):
        """
        Для GET-запросов возвращаем один сериализатор,
        для POST — другой (приём и отображение могут отличаться).
        """
        if self.request.method == "GET":
            return StudentSerializerGET
        return StudentSerializerPOST

    def get_queryset(self):
        """
        Возвращает список Student-записей, относящихся к текущей сессии.
        Если session_id нет, вернётся пустой набор.
        """
        if self.request.user.is_staff:
            return Student.objects.all()

        session_id = self.request.session.get("session_id")
        if not session_id:
            return Student.objects.none()
        return Student.objects.filter(session_id=session_id)

    # def create(self, request, *args, **kwargs):
    #     """
    #     Создаёт новый Student-объект, при необходимости генерируя новый session_id.
    #     """
    #     session_id = request.session.get("session_id")
    #
    #
    #     if not session_id:
    #         session_id = str(uuid.uuid4())
    #         request.session["session_id"] = session_id
    #
    #     data = request.data.copy()
    #     data["session_id"] = session_id
    #
    #     serializer = self.get_serializer(data=data)
    #     serializer.is_valid(raise_exception=True)
    #     student = serializer.save()
    #
    #     return Response(
    #         StudentSerializerGET(student).data,
    #         status=status.HTTP_201_CREATED
    #     )
    def create(self, request, *args, **kwargs):
        session_id = request.session.get("session_id")
        if not session_id:
            session_id = str(uuid.uuid4())
            request.session["session_id"] = session_id

        data = request.data.copy()
        data["session_id"] = session_id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()

        return Response(
            StudentSerializerGET(student).data,
            status=status.HTTP_201_CREATED
        )

class RegularPersonFormListAPIView(ListCreateAPIView):
    queryset = RegularPerson.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return RegularPersonGET
        return RegularPersonPOST

    def get_queryset(self):
        if self.request.user.is_staff:
            return RegularPerson.objects.all()

        session_id = self.request.session.get('session_id')
        if not session_id:
            return RegularPerson.objects.none()
        return RegularPerson.objects.filter(session_id=session_id)

    # def create(self, request, *args, **kwargs):
    #     session_id = request.session.get('session_id')
    #
    #     if not session_id:
    #         session_id = str(uuid.uuid4())
    #         request.session['session_id'] = session_id
    #
    #     data = request.data.copy()
    #     data['session_id'] = session_id
    #
    #     serializer = self.get_serializer(data=data)
    #     serializer.is_valid(raise_exception=True)
    #     regular_person = serializer.save()
    #
    #     return Response(
    #         RegularPersonGET(regular_person).data,
    #         status=status.HTTP_201_CREATED
    #     )
    def create(self, request, *args, **kwargs):
        session_id = request.session.get("session_id")
        if not session_id:
            session_id = str(uuid.uuid4())
            request.session["session_id"] = session_id

        data = request.data.copy()
        data["session_id"] = session_id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        regular_person = serializer.save()

        return Response(
            RegularPersonGET(regular_person).data,
            status=status.HTTP_201_CREATED
        )


class SessionInfoView(APIView):
    def get(self, request, format=None):
        session_id = request.GET.get("session_id")

        if not session_id:
            session_id = request.query_params.get('session_id')

        if not session_id:
            return Response(
                {
                    "detail": "not find",
                    "type": "n"
                }
            )
        try:
            session_uuid = uuid.UUID(session_id)
        except ValueError:
            return {
                "detail": "not allowed",
                "type": "n"
            }

        student = Student.objects.filter(session_id=session_uuid)
        regular_person = RegularPerson.objects.filter(session_id=session_uuid)

        session_serializer = SessionInfoSerializer(
            {
                "students": student,
                "regular_persons": regular_person
            }
        )

        return Response(
            session_serializer.data,
            status=status.HTTP_200_OK
        )


