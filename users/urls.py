from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='users_index'),  # http://localhost:8000/
]
