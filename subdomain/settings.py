"""
Django settings for subdomain project.

Generated by 'django-admin startproject' using Django 3.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
from decouple import config
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [config("ALLOWED_HOSTS")]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'home',
    'admin.dashboard',
    'admin.settings',
    'channels',
    'chat',
    'payment',
    'static_website'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # -------------Custom middleware------------
    'subdomain.middleware.CheckSubdomainMiddleware',
    'subdomain.middleware.CheckAdminValidUserMiddleware',
    'subdomain.middleware.LoginMiddleware',
    'subdomain.middleware.AddNetworkUserMiddleware',
    'subdomain.middleware.CheckTokenValidityMiddleware',
    'subdomain.middleware.CheckPlanMiddleware',
    'subdomain.middleware.CheckMaintenance',
    # 'subdomain.middleware.CheckPayment',
    'subdomain.middleware.AjaxMiddleware',
]

ROOT_URLCONF = 'subdomain.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'packages.context_processors.subdomain_admin_settings',
                'packages.context_processors.site_url',
                'packages.context_processors.subdomain_site_details',
                'packages.context_processors.user_personal_info',
                'packages.context_processors.aws_url',
                'packages.context_processors.node_url',
            ],
        },
    },
]

WSGI_APPLICATION = 'subdomain.wsgi.application'
ASGI_APPLICATION = 'subdomain.asgi.application'

CHANNEL_LAYERS = {
    # "default": {
    #     # This example app uses the Redis channel layer implementation channels_redis
    #     "BACKEND": "channels_redis.core.RedisChannelLayer",
    #     "CONFIG": {
    #         #"hosts": [("redis://:EXUxhhrTkJA8CMk72Fsvrx0dQkzPQL8B@redis-17485.c245.us-east-1-3.ec2.cloud.redislabs.com:17485", 6379)],
    #         "hosts": [("localhost", 6379)],
    #     },
    # },
}


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ---------------Redis Cache Setup--------------
SESSION_REDIS = {
    # 'host': 'host.docker.internal',
    'host': 'cache',
    'port': 6379,
    'db': 3,
    #'password': config('REDIS_PASSWORD'),  # ----Redis Password, it need too be create
    'prefix': 'session',
    'socket_timeout': 1
}

# ----------Setting for simple session----------
# SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

# ---------------Redis Session--------------
SESSION_ENGINE = 'redis_sessions.session'


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
HTTPS = config('HTTPS')
CACHE_TTL = config('CACHE_TTL')
BASE_URL = config('BASE_URL')
ALLOW_URL = config('ALLOW_URL')
LOGIN_URL = config('LOGIN_URL')
API_URL = config('API_URL')
AUTH_TOKEN = config('AUTH_TOKEN')
CALLBACK_LOGIN_URL = config('CALLBACK_LOGIN_URL')
SERVER_SETUP = config('SERVER_SETUP')
NOT_FOUND_REDIRECTION = config('NOT_FOUND_REDIRECTION')
URL_SCHEME = config('URL_SCHEME')
AWS_ACCESS_KEY = config("AWS_ACCESS_KEY")
AWS_SECRET_KEY = config("AWS_SECRET_KEY")
AWS_BUCKET_NAME = config("AWS_BUCKET_NAME")
AWS_URL = config("AWS_URL")
DOMAIN_NAME_URL = config("DOMAIN_NAME_URL")
IS_SERVER = config("IS_SERVER")
NODE_URL = config("NODE_URL")
GOOGLE_RECAPTCHA_SECRET_KEY = config('GOOGLE_RECAPTCHA_SECRET_KEY')
CAPTCHA_SITE_KEY = config('CAPTCHA_SITE_KEY')
# ---------------Stripe Payment----------------
STRIPE_PUBLIC_KEY = config('STRIPE_PUBLIC_KEY')
STRIPE_SECRET_KEY = config('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = config('STRIPE_WEBHOOK_SECRET')

GEOLOCATOR_EMAIL = config('GEOLOCATOR_EMAIL')
SERVER_ON_MAINTENANCE = config('SERVER_ON_MAINTENANCE')
GOOGLE_MAP_KEY = config('GOOGLE_MAP_KEY')
