from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response


from todoList.models import Todo
from .serializers import TodoSerializer

# Create your views here.

class ListTodo(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def delete(self,request,*args,**kwargs):
        try:
            todo = self.get_object()
            todo.delete()
            return Response({'message':'Task Removed Successfully!','status':'success'},status = status.HTTP_200_OK)
        except Todo.DoesNotExist:
            return Response({'message':'Task NOT Found','status':'error'},status = status.HTTP_404_NOT_FOUND)


def index(request):
    return render(request,'index.html')