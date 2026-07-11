import React, { useState, useEffect } from 'react';
import api from '../../api';
import './CategoryFilter.css';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/recipes/categories/');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="category-filter-loading">
                <span>Загрузка категорий...</span>
            </div>
        );
    }

    return (
        <div className="category-filter">
            <button
                className={`category-filter-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => onCategoryChange(null)}
            >
                Все рецепты
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    className={`category-filter-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                    onClick={() => onCategoryChange(category.slug)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;