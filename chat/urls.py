from django.urls import path
from . import views

urlpatterns = [
    # path('', views.chat_list, name='index'),
    path('chat-history/', views.chat_history, name='chat-history'),
    path('save-chat-message/', views.save_chat_message, name='save-chat-message'),
    path('', views.chat, name='chat')
]