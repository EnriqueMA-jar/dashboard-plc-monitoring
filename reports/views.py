from django.shortcuts import render

# Create your views here.
def reports_view(request):
    return render(request, 'reports/reports.html')
