import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Каталог Рецептов</h3>
                        <p>Готовьте с удовольствием!</p>
                    </div>
                    <div className="footer-section">
                        <h4>Разделы</h4>
                        <ul>
                            <li><a href="/">Главная</a></li>
                            <li><a href="/recipes">Рецепты</a></li>
                            <li><a href="/about">О нас</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Контакты</h4>
                        <p>info@recipe-catalog.ru</p>
                        <p>+7 (999) 123-45-67</p>
                    </div>

                </div>
                <div className="footer-bottom">
                    <p>© 2026 Каталог Рецептов</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;