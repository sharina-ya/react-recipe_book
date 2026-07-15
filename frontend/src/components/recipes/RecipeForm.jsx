import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import './RecipeForm.css';

const RecipeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        category: '',
        cooking_time: '',
        servings: '',
        image: null,
    });

    const isEditing = !!id;

    // Загрузка категорий
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/recipes/categories/');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Не удалось загрузить категории');
            }
        };
        fetchCategories();
    }, []);

    // Загрузка данных рецепта для редактирования
    useEffect(() => {
        if (isEditing) {
            const fetchRecipe = async () => {
                try {
                    setLoading(true);
                    const response = await api.get(`/recipes/${id}/`);
                    const recipe = response.data;
                    setFormData({
                        title: recipe.title || '',
                        description: recipe.description || '',
                        ingredients: recipe.ingredients || '',
                        steps: recipe.steps || '',
                        category: recipe.category?.id || '',
                        cooking_time: recipe.cooking_time || '',
                        servings: recipe.servings || '',
                        image: null,
                    });
                } catch (error) {
                    console.error('Error fetching recipe:', error);
                    setError('Не удалось загрузить рецепт');
                } finally {
                    setLoading(false);
                }
            };
            fetchRecipe();
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Проверяем обязательные поля
            if (!formData.title.trim()) {
                throw new Error('Название рецепта обязательно');
            }
            if (!formData.description.trim()) {
                throw new Error('Описание обязательно');
            }
            if (!formData.ingredients.trim()) {
                throw new Error('Ингредиенты обязательны');
            }
            if (!formData.steps.trim()) {
                throw new Error('Шаги приготовления обязательны');
            }
            if (!formData.category) {
                throw new Error('Выберите категорию');
            }

            const formDataToSend = new FormData();

            // Добавляем все поля в FormData
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('ingredients', formData.ingredients.trim());
            formDataToSend.append('steps', formData.steps.trim());
            formDataToSend.append('category', formData.category);

            if (formData.cooking_time) {
                formDataToSend.append('cooking_time', formData.cooking_time);
            }
            if (formData.servings) {
                formDataToSend.append('servings', formData.servings);
            }
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            // Отладка: выводим содержимое FormData
            console.log('Sending form data:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            let response;
            if (isEditing) {
                // Обновляем существующий рецепт
                response = await api.put(`/recipes/${id}/`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Создаем новый рецепт
                response = await api.post('/recipes/', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            console.log('Response:', response.data);

            // Перенаправляем на страницу рецепта
            navigate(`/recipes/${response.data.id}`);
        } catch (error) {
            console.error('Error saving recipe:', error);

            // Проверяем конкретные ошибки от бэкенда
            if (error.response?.data) {
                const errors = error.response.data;
                console.log('Backend errors:', errors);

                // Формируем понятное сообщение об ошибке
                let errorMessage = '';
                if (typeof errors === 'object') {
                    for (let [field, messages] of Object.entries(errors)) {
                        if (Array.isArray(messages)) {
                            errorMessage += `${field}: ${messages.join(', ')}\n`;
                        } else if (typeof messages === 'string') {
                            errorMessage += `${field}: ${messages}\n`;
                        } else if (typeof messages === 'object') {
                            errorMessage += `${field}: ${JSON.stringify(messages)}\n`;
                        }
                    }
                } else if (typeof errors === 'string') {
                    errorMessage = errors;
                } else {
                    errorMessage = 'Ошибка при сохранении рецепта';
                }
                setError(errorMessage || 'Ошибка при сохранении рецепта');
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Произошла неизвестная ошибка. Попробуйте снова.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="recipe-form-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка рецепта...</p>
            </div>
        );
    }

    return (
        <div className="recipe-form-container">
            <div className="recipe-form-card">
                <h2 className="recipe-form-title">
                    {isEditing ? '✏️ Редактировать рецепт' : '➕ Создать новый рецепт'}
                </h2>

                {error && (
                    <div className="recipe-form-error">
                        <strong>Ошибка:</strong>
                        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{error}</pre>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="recipe-form">
                    <div className="form-group">
                        <label htmlFor="title">Название рецепта *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Например: Омлет с овощами"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Категория *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cooking_time">Время приготовления (мин)</label>
                            <input
                                type="number"
                                id="cooking_time"
                                name="cooking_time"
                                value={formData.cooking_time}
                                onChange={handleChange}
                                min="1"
                                placeholder="30"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="servings">Количество порций</label>
                            <input
                                type="number"
                                id="servings"
                                name="servings"
                                value={formData.servings}
                                onChange={handleChange}
                                min="1"
                                placeholder="4"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Краткое описание блюда..."
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ingredients">Ингредиенты *</label>
                        <textarea
                            id="ingredients"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Яйца - 3 шт&#10;Молоко - 50 мл&#10;Помидор - 1 шт&#10;Перец болгарский - 1 шт"
                            className="form-textarea"
                        />
                        <small className="form-hint">Каждый ингредиент на новой строке</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="steps">Шаги приготовления *</label>
                        <textarea
                            id="steps"
                            name="steps"
                            value={formData.steps}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="1. Взбейте яйца с молоком&#10;2. Нарежьте овощи&#10;3. Обжарьте овощи&#10;4. Залейте яичной смесью&#10;5. Готовьте под крышкой 5-7 минут"
                            className="form-textarea"
                        />
                        <small className="form-hint">Каждый шаг на новой строке</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Изображение</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="form-file"
                        />
                        <small className="form-hint">
                            {isEditing ? 'Оставьте пустым, чтобы сохранить текущее изображение' : 'Загрузите изображение блюда'}
                        </small>
                    </div>

                    <div className="recipe-form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/recipes')}
                            className="btn-cancel"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-submit-recipe"
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-small"></span>
                                    {isEditing ? 'Сохраняем...' : 'Создаем...'}
                                </>
                            ) : (
                                <>{isEditing ? '💾 Сохранить' : '➕ Создать рецепт'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecipeForm;