from django.shortcuts import render,redirect
from rest_framework import generics,status
from rest_framework.response import Response
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from .models import *
from django.db.models import Q
from django.contrib import messages
from rest_framework.permissions import IsAuthenticated



from todoList.models import Todo
from .serializers import TodoSerializer

# Create your views here.

class ListTodo(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

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

@login_required
def index(request):
    return render(request,'index.html')

# Authentication code below
def register(request):
    if request.method == "POST":
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        phone_number = request.POST.get('phone_number')
        
        todo_User = todoUser.objects.filter(
            Q(email = email)|Q(phone_number = phone_number)
        )

        if todo_User.exists():
            messages.warning(request,"Account exists with Email or Phone Number")
            return redirect ('/register/')
        

        todo_User = todoUser.objects.create(
             username = phone_number,
             first_name = first_name,
             last_name = last_name,
             email = email,
             password = password,
             phone_number = phone_number,
        )

        todo_User.set_password(password)
        todo_User.save()
        messages.success(request,"Account Registered")

    return render(request,'register.html')


def login_page(request):
    if request.method == "POST":
        # Getting email and password from inputs
        email = request.POST.get('email')
        password = request.POST.get('password')

        todo_user = todoUser.objects.filter(email = email) #creating object for user based on email

        if not todo_user.exists(): # checking if user exists or not
            messages.warning(request,"Account does not exists please register")
            return redirect('/login/')
        
        # checking if userid and password is correct
        todo_user = authenticate(username = todo_user[0].username,password = password) 

        if todo_user:
            messages.success(request,"login Success")
            login(request,todo_user)
            return redirect('/')
        messages.warning(request,"Invalid Credentials")

        return redirect('/login/')
    return render(request,'login_page.html')

def logout_page(request):
    logout(request)
    return redirect('/login/')
