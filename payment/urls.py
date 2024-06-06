from django.urls import path
from .views import *

urlpatterns = [
    path('create-checkout-session/<id>/', create_checkout_session, name='checkout_session'),
    path('success/', PaymentSuccessView.as_view(), name='success'),
    path('success-payment/', SuccessPaymentView.as_view(), name='success_payment'),
    path('failed/', PaymentFailedView.as_view(), name='failed'),
    path('my_webhook/', webhook, name='my_webhook_view'),
    path('registration-create-checkout-session/<listing_id>/', registration_create_checkout_session, name='registration-checkout_session'),
]

