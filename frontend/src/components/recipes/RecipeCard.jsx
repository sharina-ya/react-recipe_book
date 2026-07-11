import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
    const defaultImage = 'https://via.placeholder.com/300x200/667eea/ffffff?text=🍳+Рецепт';

    return (
        <div className="recipe-card">
            <Link to={`/recipes/${recipe.id}`} className="recipe-card-link">
                <div className="recipe-card-image">
                    <img
                        src={recipe.image || defaultImage}
                        alt={recipe.title}
                        onError={(e) => {
                            e.target.src = defaultImage;
                        }}
                    />
                    <span className="recipe-category-badge">
                        {recipe.category_name || 'Без категории'}
                    </span>
                </div>
                <div className="recipe-card-content">
                    <h3 className="recipe-card-title">{recipe.title}</h3>
                    <p className="recipe-card-description">
                        {recipe.description?.substring(0, 100)}...
                    </p>
                    <div className="recipe-card-footer">
                        <span className="recipe-card-author">
                            👤 {recipe.author_name || 'Автор не указан'}
                        </span>
                        <span className="recipe-card-comments">
                            💬 {recipe.comments_count || 0}
                        </span>
                        {recipe.cooking_time && (
                            <span className="recipe-card-time">
                                ⏱️ {recipe.cooking_time} мин
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default RecipeCard;