import uuid
from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator

class Faculty(models.Model):
    class Degree(models.TextChoices):
        bachelor = "bachelor", "Bakalavr"
        master = "master", "Magistratura"
        doctoral = "doctoral", "Doctorantura"

    name = models.CharField(max_length=255, verbose_name="Fakultet nomi")
    degree = models.CharField(max_length=50, choices=Degree.choices, verbose_name="Daraja")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Fakultet"
        verbose_name_plural = "Fakultetlar"


class Sport(models.Model):
    name = models.CharField(max_length=100, verbose_name="Sport turi")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Sport turi"
        verbose_name_plural = "Sport turlari"


class Person(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, editable=False)
    name1 = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(2, message="Ism kamida 2 ta belgidan iborat bo'lishi kerak.")],
        verbose_name='Ism'
    )
    name2 = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3, message="Familiya kamida 3 ta belgidan iborat bo'lishi kerak.")],
        verbose_name='Familiya'
    )
    name3 = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        validators=[MinLengthValidator(3, message="Ota ismi kamida 3 ta belgidan iborat bo'lishi kerak.")],
        verbose_name='Ota ismi'
    )
    age = models.DateField(verbose_name="Tug'ilgan sana")
    sports = models.ManyToManyField(to=Sport, verbose_name="Sport turlari")
    phone = models.CharField(
    max_length=25,
    verbose_name="Telefon raqam",
    blank=True
    )

    telegram = models.CharField(max_length=255, verbose_name="Telegram")
    date = models.DateField(auto_now_add=True, verbose_name="Yaratilgan sana")

    # Новое поле для фото:
    photo = models.ImageField(
        upload_to='photos/',    # Папка внутри MEDIA_ROOT
        null=True,
        blank=True,
        verbose_name="Rasm (Avatar)"
    )

    class Meta:
        abstract = True


class Student(Person):
    degree = models.CharField(
        max_length=50,
        choices=Faculty.Degree.choices,
        verbose_name="Daraja"
    )
    faculty = models.ForeignKey(
        to=Faculty,
        on_delete=models.DO_NOTHING,
        null=False,
        blank=False,
        verbose_name="Fakultet"
    )

    def __str__(self):
        return f"{self.name1} {self.name2}"

    class Meta:
        db_table = "student_form_table"
        verbose_name = "Talaba"
        verbose_name_plural = "Talabalar"


class RegularPerson(Person):
    home = models.CharField(
        max_length=255,
        verbose_name="Manzil"
    )

    def __str__(self):
        return f"{self.name1} {self.name2}"

    class Meta:
        db_table = "regular_persons_table"
        verbose_name = "Oddiy foydalanuvchi"
        verbose_name_plural = "Oddiy foydalanuvchilar"
