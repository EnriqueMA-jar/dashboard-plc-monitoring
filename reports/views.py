from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# @login_required(login_url='/')
# Create your views here.
def reports_view(request):
    return render(request, 'reports/reports.html')

# @login_required(login_url='/')
def historic(request):
    return render(request, 'reports/reports_historic.html')

def pruebas(request):
    return render(request, 'reports/pruebas_charts.html')