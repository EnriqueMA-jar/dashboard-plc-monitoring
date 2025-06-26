from django.shortcuts import render

# Create your views here.
def records_view(request):
    return render(request, 'records/records.html')
