from rest_framework import serializers
from .models import Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.email', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'recipe', 'author', 'author_name', 'author_id', 'text', 'created_at', 'updated_at', 'is_edited')
        read_only_fields = ('author', 'created_at', 'updated_at', 'is_edited')