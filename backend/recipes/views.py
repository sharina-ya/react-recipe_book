from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Category, Recipe
from .serializers import CategorySerializer, RecipeSerializer, RecipeDetailSerializer
from django.utils.text import slugify

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Recipe.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset

    def perform_create(self, serializer):

        title = serializer.validated_data.get('title')
        slug = slugify(title)


        original_slug = slug
        counter = 1
        while Recipe.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1

        serializer.save(author=self.request.user, slug=slug)

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RecipeDetailSerializer
        return RecipeSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_update(self, serializer):
        title = serializer.validated_data.get('title')
        if title:
            slug = slugify(title)

            original_slug = slug
            counter = 1
            while Recipe.objects.filter(slug=slug).exclude(pk=self.kwargs['pk']).exists():
                slug = f"{original_slug}-{counter}"
                counter += 1
            serializer.save(slug=slug)
        else:
            serializer.save()