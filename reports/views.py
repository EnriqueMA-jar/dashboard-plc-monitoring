from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# @login_required(login_url='/')
# Create your views here.
def reports_view(request):
    return render(request, 'reports/reports.html')



def pruebas(request):
    return render(request, 'reports/pruebas_charts.html')

def pruebas_datatable(request):
    return render(request, 'reports/pruebas_datatable.html')