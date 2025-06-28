from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# @login_required(login_url='/')
# Create your views here.
def reports_view(request):
    return render(request, 'reports/reports.html')

# @login_required(login_url='/')
def charts_tests(request):
    return render(request, 'reports/pruebas_charts.html')
