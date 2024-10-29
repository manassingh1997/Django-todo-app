from django.urls import path
from .views import ListTodo, DetailTodo,index

urlpatterns = [
    path("",index,name="index"),
    path("api/todos/",ListTodo.as_view(),name ="todo-list-create"),
    path("api/todos/<int:pk>/",DetailTodo.as_view(), name="todo-detail"),
]