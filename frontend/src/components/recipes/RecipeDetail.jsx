import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import CommentSection from '../comments/CommentSection';
import './RecipeDetail.css';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/recipes/${id}/`);
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe:', error);
                setError('Рецепт не найден');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот рецепт?')) {
            try {
                await api.delete(`/recipes/${id}/`);
                navigate('/recipes');
            } catch (error) {
                console.error('Error deleting recipe:', error);
                alert('Не удалось удалить рецепт');
            }
        }
    };

    if (loading) {
        return (
            <div className="recipe-detail-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка рецепта...</p>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="recipe-detail-error">
                <h2>😕 Рецепт не найден</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/recipes')} className="btn-back">
                    Вернуться к рецептам
                </button>
            </div>
        );
    }

    const defaultImage = 'https://via.placeholder.com/800x400/667eea/ffffff?text=🍳+Рецепт';

    return (
        <div className="recipe-detail-container">
            <div className="recipe-detail-image-container">
                <img
                    src={recipe.image || defaultImage}
                    alt={recipe.title}
                    className="recipe-detail-image"
                    onError={(e) => {
                        e.target.src = defaultImage;
                    }}
                />
                <div className="recipe-detail-overlay">
                    <div className="recipe-detail-category">
                        {recipe.category?.name || 'Без категории'}
                    </div>
                </div>
            </div>

            <div className="recipe-detail-content">
                <div className="recipe-detail-header">
                    <h1 className="recipe-detail-title">{recipe.title}</h1>
                    <div className="recipe-detail-meta">
                        <span className="meta-item">
                            👤 {recipe.author || 'Автор не указан'}
                        </span>
                        {recipe.cooking_time && (
                            <span className="meta-item">
                                ⏱️ {recipe.cooking_time} мин
                            </span>
                        )}
                        {recipe.servings && (
                            <span className="meta-item">
                                🍽️ {recipe.servings} порций
                            </span>
                        )}
                        <span className="meta-item">
                            📅 {new Date(recipe.created_at).toLocaleDateString('ru-RU')}
                        </span>
                    </div>
                </div>

                <div className="recipe-detail-description">
                    <h3>Описание</h3>
                    <p>{recipe.description}</p>
                </div>

                <div className="recipe-detail-ingredients">
                    <h3>Ингредиенты</h3>
                    <div className="ingredients-list">
                        {recipe.ingredients?.split('\n').map((item, index) => (
                            <div key={index} className="ingredient-item">
                                <span className="ingredient-bullet">•</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="recipe-detail-steps">
                    <h3>Шаги приготовления</h3>
                    <div className="steps-list">
                        {recipe.steps?.split('\n').map((step, index) => (
                            <div key={index} className="step-item">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-text">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {(isAdmin || user?.id === recipe.author_id) && (
                    <div className="recipe-detail-actions">
                        <button
                            onClick={() => navigate(`/recipes/${id}/edit`)}
                            className="btn-edit"
                        >
                            ✏️ Редактировать
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn-delete"
                        >
                            🗑️ Удалить
                        </button>
                    </div>
                )}

                <div className="recipe-detail-comments">
                    <CommentSection recipeId={id} />
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;