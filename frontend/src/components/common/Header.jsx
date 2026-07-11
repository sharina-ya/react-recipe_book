import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

                    {isAdmin && (
                        <Link to="/recipes/create" className="nav-link nav-link-admin">
                            + Добавить рецепт
                        </Link>
                    )}
                </nav>

                <div className="auth-section">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <span className="user-email">{user?.email}</span>
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