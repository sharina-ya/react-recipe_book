from rest_framework import serializers
from .models import Category, Recipe

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.email', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class RecipeDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = serializers.StringRelatedField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def get_comments(self, obj):
        try:
            from comments.serializers import CommentSerializer
            comments = obj.comments.all()
            return CommentSerializer(comments, many=True).data
        except ImportError:
            return []