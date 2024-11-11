from rest_framework import serializers
from todoList import models

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "title",
            "due_date",
            "description",
        )
        model = models.Todo