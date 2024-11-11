from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class todoUser(User):
    phone_number = models.CharField(max_length=10,null=True,blank=True)

    class meta:
        db_table = "todo_users"
