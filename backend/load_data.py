import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recipe_backend.settings')
django.setup()

from recipes.models import Category, Recipe
from django.contrib.auth import get_user_model

User = get_user_model()

# Создаем категории
categories_data = [
    {'name': 'Завтраки', 'slug': 'zavtraki'},
    {'name': 'Супы', 'slug': 'supy'},
    {'name': 'Салаты', 'slug': 'salaty'},
    {'name': 'Горячие блюда', 'slug': 'goryachie-blyuda'},
    {'name': 'Десерты', 'slug': 'deserty'},
    {'name': 'Напитки', 'slug': 'napitki'},
    {'name': 'Выпечка', 'slug': 'vypechka'},
    {'name': 'Быстрые рецепты', 'slug': 'bystrye-recepty'},
]

for cat in categories_data:
    Category.objects.get_or_create(**cat)

# Создаем тестового пользователя
user, created = User.objects.get_or_create(
    email='user@example.com',
    defaults={
        'username': 'user',
        'password': 'password123'
    }
)

# Создаем рецепты
recipes_data = [
    {
        'title': 'Омлет с овощами',
        'slug': 'omlet-s-ovoschami',
        'description': 'Нежный омлет с свежими овощами - идеальный завтрак',
        'ingredients': 'Яйца - 3 шт, Молоко - 50 мл, Помидор - 1 шт, Перец болгарский - 1 шт, Соль, перец - по вкусу',
        'steps': '1. Взбейте яйца с молоком. 2. Нарежьте овощи. 3. Обжарьте овощи на сковороде. 4. Залейте яичной смесью. 5. Готовьте под крышкой 5-7 минут.',
        'category': Category.objects.get(slug='zavtraki'),
        'author': user,
        'cooking_time': 15,
        'servings': 2
    },
    {
        'title': 'Куриный суп',
        'slug': 'kurinyy-sup',
        'description': 'Классический куриный суп с домашней лапшой',
        'ingredients': 'Куриное филе - 500 г, Картофель - 3 шт, Морковь - 1 шт, Лук - 1 шт, Лапша - 100 г, Зелень - по вкусу',
        'steps': '1. Сварите куриное филе. 2. Добавьте нарезанные овощи. 3. Варите до готовности. 4. Добавьте лапшу и зелень.',
        'category': Category.objects.get(slug='supy'),
        'author': user,
        'cooking_time': 45,
        'servings': 4
    },
    # Добавьте остальные рецепты по аналогии
]

for recipe in recipes_data:
    Recipe.objects.get_or_create(slug=recipe['slug'], defaults=recipe)

print("Данные успешно загружены!")