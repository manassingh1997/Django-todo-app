from rest_framework import serializers
from todoList import models

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "title",
            "description"
        )
        model = models.Todo