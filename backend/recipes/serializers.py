from rest_framework import serializers
from .models import Category, Recipe
from django.utils.text import slugify

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
        read_only_fields = ('created_at', 'updated_at', 'author')
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True},
            'category': {'required': False, 'allow_null': True},
        }

    def validate_title(self, value):
        return value

    def create(self, validated_data):

        if 'slug' not in validated_data or not validated_data.get('slug'):
            title = validated_data.get('title', '')
            if title:
                slug = slugify(title)

                original_slug = slug
                counter = 1
                while Recipe.objects.filter(slug=slug).exists():
                    slug = f"{original_slug}-{counter}"
                    counter += 1
                validated_data['slug'] = slug
            else:

                import uuid
                validated_data['slug'] = f"recipe-{uuid.uuid4().hex[:8]}"

        return super().create(validated_data)

    def update(self, instance, validated_data):

        title = validated_data.get('title')
        if title and title != instance.title:
            slug = slugify(title)
            original_slug = slug
            counter = 1
            while Recipe.objects.filter(slug=slug).exclude(pk=instance.pk).exists():
                slug = f"{original_slug}-{counter}"
                counter += 1
            validated_data['slug'] = slug

        return super().update(instance, validated_data)

class RecipeDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = serializers.StringRelatedField()

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')