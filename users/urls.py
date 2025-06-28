from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('', views.index_view, name='users_index'),  # http://localhost:8000/
    path('register', views.register_view, name='register'),
    path('manage', views.manage_view, name='manage'),
    path('help', views.help_view, name='help'),
]
