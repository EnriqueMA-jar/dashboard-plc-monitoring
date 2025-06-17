from django.shortcuts import render

def home(request):
    """
    Render the home page of the PLC Monitoring Frontend.
    """
    return render(request, 'index.html')