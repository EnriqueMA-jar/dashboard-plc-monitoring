from django.shortcuts import render
from django.contrib.auth.decorators import login_required

#@login_required(login_url='/')
# Create your views here.
def records_view(request):
    return render(request, 'records/records.html')
