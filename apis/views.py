from django.shortcuts import render
from rest_framework import generics

from todoList.models import Todo
from .serializers import TodoSerializer
# Create your views here.

class ListTodo(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


def index(request):
    return render(request,'index.html')