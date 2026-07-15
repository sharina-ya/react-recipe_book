from rest_framework import serializers
from .models import Comment

class CommentForRecipeSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.email', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author_name', 'author_id', 'text', 'created_at', 'updated_at', 'is_edited')