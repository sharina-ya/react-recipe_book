import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, logout, isAdmin } = useAuth();
    const [userRecipes, setUserRecipes] = useState([]);
    const [userComments, setUserComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Получаем рецепты пользователя
                const recipesResponse = await api.get('/recipes/');
                const userRecipesData = recipesResponse.data.filter(
                    recipe => recipe.author === user?.email || recipe.author === user?.username
                );
                setUserRecipes(userRecipesData);

                // Получаем комментарии пользователя
                const commentsResponse = await api.get('/comments/');
                const userCommentsData = commentsResponse.data.filter(
                    comment => comment.author === user?.email || comment.author === user?.username
                );
                setUserComments(userCommentsData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const handleDeleteRecipe = async (recipeId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот рецепт?')) return;

        try {
            await api.delete(`/recipes/${recipeId}/`);
            setUserRecipes(userRecipes.filter(r => r.id !== recipeId));
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Не удалось удалить рецепт');
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Информация о пользователе */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.username} />
                        ) : (
                            <div className="avatar-placeholder">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{user?.username}</h1>
                        <p className="profile-email">{user?.email}</p>
                        {isAdmin && (
                            <span className="profile-admin-badge">👑 Администратор</span>
                        )}
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{userRecipes.length}</span>
                                <span className="stat-label">Рецептов</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{userComments.length}</span>
                                <span className="stat-label">Комментариев</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button onClick={logout} className="btn-logout-profile">
                            Выйти
                        </button>
                    </div>
                </div>

                {/* Вкладки */}
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 Профиль
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recipes')}
                    >
                        📚 Мои рецепты ({userRecipes.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('comments')}
                    >
                        💬 Мои комментарии ({userComments.length})
                    </button>
                    {isAdmin && (
                        <Link to="/recipes/create" className="tab-btn tab-btn-create">
                            ➕ Создать рецепт
                        </Link>
                    )}
                </div>

                {/* Контент вкладок */}
                <div className="profile-content">
                    {activeTab === 'profile' && (
                        <div className="profile-info-tab">
                            <div className="info-card">
                                <h3>Информация об аккаунте</h3>
                                <div className="info-row">
                                    <span className="info-label">Имя пользователя:</span>
                                    <span className="info-value">{user?.username}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{user?.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Дата регистрации:</span>
                                    <span className="info-value">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Статус:</span>
                                    <span className="info-value">
                                        {isAdmin ? '👑 Администратор' : '👤 Пользователь'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'recipes' && (
                        <div className="profile-recipes-tab">
                            {userRecipes.length === 0 ? (
                                <div className="empty-state">
                                    <p>😕 У вас пока нет рецептов</p>
                                    {isAdmin && (
                                        <Link to="/recipes/create" className="btn-create-first">
                                            Создать первый рецепт
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="user-recipes-grid">
                                    {userRecipes.map(recipe => (
                                        <div key={recipe.id} className="user-recipe-card">
                                            <Link to={`/recipes/${recipe.id}`} className="user-recipe-link">
                                                <div className="user-recipe-image">
                                                    <img
                                                        src={recipe.image || 'https://via.placeholder.com/300x200/667eea/ffffff?text=🍳+Рецепт'}
                                                        alt={recipe.title}
                                                    />
                                                    <span className="user-recipe-category">
                                                        {recipe.category_name || 'Без категории'}
                                                    </span>
                                                </div>
                                                <div className="user-recipe-info">
                                                    <h4>{recipe.title}</h4>
                                                    <p>{recipe.description?.substring(0, 80)}...</p>
                                                    <div className="user-recipe-meta">
                                                        <span>💬 {recipe.comments_count || 0}</span>
                                                        {recipe.cooking_time && (
                                                            <span>⏱️ {recipe.cooking_time} мин</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="user-recipe-actions">
                                                <Link to={`/recipes/${recipe.id}/edit`} className="btn-edit-small">
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteRecipe(recipe.id)}
                                                    className="btn-delete-small"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <div className="profile-comments-tab">
                            {userComments.length === 0 ? (
                                <div className="empty-state">
                                    <p>😕 У вас пока нет комментариев</p>
                                </div>
                            ) : (
                                <div className="user-comments-list">
                                    {userComments.map(comment => (
                                        <div key={comment.id} className="user-comment-item">
                                            <div className="user-comment-header">
                                                <Link to={`/recipes/${comment.recipe}`} className="user-comment-recipe-link">
                                                    К рецепту #{comment.recipe}
                                                </Link>
                                                <span className="user-comment-date">
                                                    {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                                                </span>
                                            </div>
                                            <p className="user-comment-text">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;