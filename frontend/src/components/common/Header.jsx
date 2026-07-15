import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const { user, logout, isAuthenticated, isAdmin, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Показываем загрузку, если проверяем авторизацию
    if (loading) {
        return (
            <header className="header">
                <div className="header-container">
                    <div className="logo">
                        <Link to="/">
                            <span className="logo-icon">🍳</span>
                            <span className="logo-text">Каталог Рецептов</span>
                        </Link>
                    </div>
                    <div className="header-loading">Загрузка...</div>
                </div>
            </header>
        );
    }

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-icon">🍳</span>
                        <span className="logo-text">Каталог Рецептов</span>
                    </Link>
                </div>

                <nav className="nav">
                    <Link to="/" className="nav-link">Главная</Link>
                    <Link to="/recipes" className="nav-link">Рецепты</Link>

                    {/* Кнопка создания рецепта для админа */}
                    {isAuthenticated && isAdmin && (
                        <Link to="/recipes/create" className="nav-link nav-link-admin">
                            ➕ Создать рецепт
                        </Link>
                    )}
                </nav>

                <div className="auth-section">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <Link to="/profile" className="user-profile-link">
                                <span className="user-avatar">👤</span>
                                <span className="user-email">{user?.email || user?.username}</span>
                            </Link>
                            {isAdmin && (
                                <span className="admin-badge">Администратор</span>
                            )}
                            <button onClick={handleLogout} className="btn-logout">
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-login">Войти</Link>
                            <Link to="/register" className="btn btn-register">Регистрация</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;