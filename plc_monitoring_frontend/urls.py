from django.contrib import admin
from django.urls import path, include
# from .views import index
# from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),  # ahora la app users se encarga del inicio
    path('dashboard/', include('dashboard.urls')),
    path('reports/', include('reports.urls')),
]
