from django.shortcuts import render

# Create your views here.
def index_view(request):
    return render(request, 'users/login.html')

def register_view(request):
    return render(request, 'users/register.html')

def manage_view(request):
    return render(request, 'users/manage.html')

def help_view(request):
    return render(request, 'users/help.html')
