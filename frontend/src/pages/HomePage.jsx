import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Добро пожаловать в <br />
                        <span className="gradient-text">Каталог Рецептов</span>
                    </h1>
                    <p className="hero-description">
                        Откройте для себя тысячи вкусных рецептов. Готовьте с удовольствием!
                    </p>
                    <div className="hero-buttons">
                        <Link to="/recipes" className="hero-btn primary">
                            Смотреть рецепты
                        </Link>
                        <Link to="/register" className="hero-btn secondary">
                            Создать аккаунт
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-emoji-grid">
                        <span className="emoji-big">🍳</span>
                        <span className="emoji-big">🥗</span>
                        <span className="emoji-big">🍰</span>
                        <span className="emoji-big">🍜</span>
                        <span className="emoji-big">🥘</span>
                        <span className="emoji-big">🍝</span>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title">Что вы найдете на сайте?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h3>Большой выбор рецептов</h3>
                        <p>Более 100 рецептов на любой вкус: от завтраков до десертов</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Умный поиск</h3>
                        <p>Ищите рецепты по категориям, ингредиентам и названиям</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💬</div>
                        <h3>Комментарии</h3>
                        <p>Делитесь опытом и обсуждайте рецепты с другими</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⭐</div>
                        <h3>Избранное</h3>
                        <p>Сохраняйте любимые рецепты и возвращайтесь к ним</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Готовы начать?</h2>
                    <p>Присоединяйтесь к сообществу любителей вкусной еды</p>
                    <Link to="/register" className="cta-btn">
                        Начать сейчас
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;