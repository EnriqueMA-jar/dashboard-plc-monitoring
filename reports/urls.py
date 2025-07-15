from django.urls import path
from . import views

app_name = 'reports'

urlpatterns = [
    path('', views.reports_view, name='reports'),
    path('pruebas', views.pruebas, name='pruebas'),
    path('pruebas-datatable', views.pruebas_datatable, name='pruebas-datatable'),
]