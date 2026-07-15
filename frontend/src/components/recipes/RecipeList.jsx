import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import RecipeCard from './RecipeCard';
import CategoryFilter from './CategoryFilter';
import './RecipeList.css';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { isAdmin } = useAuth(); // Добавляем проверку на админа

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            setError(null);
            let url = '/recipes/';
            const params = new URLSearchParams();

            if (selectedCategory) {
                params.append('category', selectedCategory);
            }
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await api.get(url);
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Не удалось загрузить рецепты. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [selectedCategory, searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes();
    };

    const handleCategoryChange = (categorySlug) => {
        setSelectedCategory(categorySlug);
    };

    if (loading) {
        return (
            <div className="recipe-list-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка рецептов...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recipe-list-error">
                <p>{error}</p>
                <button onClick={fetchRecipes} className="btn-retry">
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="recipe-list-container">
            <div className="recipe-list-header">
                <h2>Все рецепты</h2>
                <div className="recipe-list-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Поиск рецептов..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">🔍</button>
                    </form>

                    {/* Кнопка создания рецепта - видна только админам */}
                    {isAdmin && (
                        <Link to="/recipes/create" className="btn-create-recipe">
                            ➕ Создать рецепт
                        </Link>
                    )}
                </div>
            </div>

            <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />

            {recipes.length === 0 ? (
                <div className="no-recipes">
                    <p>😕 Рецептов не найдено</p>
                    <p className="no-recipes-hint">Попробуйте изменить фильтры или поиск</p>
                    {isAdmin && (
                        <Link to="/recipes/create" className="btn-create-first">
                            Создать первый рецепт
                        </Link>
                    )}
                </div>
            ) : (
                <div className="recipes-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeList;