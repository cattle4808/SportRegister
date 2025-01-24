from pathlib import Path
import environ

# Читаем переменные окружения из файла .env
env = environ.Env()
env.read_env(".env")

# Базовая директория проекта
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Секретный ключ
SECRET_KEY = env.str("SECRET_KEY")

# Режим работы (DEBUG)
DEBUG = env.bool("DEBUG", default=False)

# Разрешённые хосты
ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "sportregister.onrender.com"
]

# Приложения проекта
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "drf_yasg",
    "corsheaders",
    "django_filters",
    "jazzmin",
]

CUSTOM_APPS = [
    "app",
    "frontend",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + CUSTOM_APPS

# Middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",  # Обязателен для WhiteNoise
    "whitenoise.middleware.WhiteNoiseMiddleware",    # Добавляем WhiteNoise
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Настройки статических файлов
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "static"  # Папка для собранных статических файлов
STATICFILES_DIRS = [
    BASE_DIR / "staticfiles",  # Папка для исходных статических файлов
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"  # WhiteNoise

# Настройки медиа-файлов (например, изображения пользователей)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"

# Настройки базы данных
DATABASES = {
    "default": {
        "ENGINE": env.str("DB_ENGINE", "django.db.backends.postgresql"),
        "NAME": env.str("DB_NAME"),
        "USER": env.str("DB_USER"),
        "PASSWORD": env.str("DB_PASSWORD"),
        "HOST": env.str("DB_HOST", "localhost"),
        "PORT": env.str("DB_PORT", "5432"),
    }
}

# Настройки Django REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 100,
}

# Локализация
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

# Установка шаблонов
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# URL-конфигурация
ROOT_URLCONF = "core.urls"
WSGI_APPLICATION = "core.wsgi.application"

# Проверка паролей
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Настройки CORS
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ["*"]

# Настройки кэша
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": env.str("REDIS_URL", "redis://localhost:6379/0"),
    }
}

# Настройки Celery
CELERY_BROKER_URL = env.str("CELERY_BROKER_URL", "redis://localhost:6379")
CELERY_RESULT_BACKEND = CELERY_BROKER_URL
CELERY_TIMEZONE = "Asia/Tashkent"

# Файлы по умолчанию
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
