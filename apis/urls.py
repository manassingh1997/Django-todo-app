from django.urls import path
from .views import *

urlpatterns = [
    path("",index,name="index"),
    path("register/",register,name="register"),
    path("login/",login_page,name="login_page"),
    path("logout/",logout_page,name="logout_page"),
    path("api/todos/",ListTodo.as_view(),name ="todo-list-create"),
    path("api/todos/<int:pk>/",DetailTodo.as_view(), name="todo-detail"),
]