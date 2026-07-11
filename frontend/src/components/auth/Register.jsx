import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        const result = await register(formData);
        if (result.success) {
            navigate('/login', { state: { message: 'Регистрация успешна! Войдите в аккаунт.' } });
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Регистрация</h2>
                    <p>Создайте аккаунт, чтобы начать</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="username"
                        />
                        {error.username && <div className="field-error">{error.username[0]}</div>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@mail.com"
                        />
                        {error.email && <div className="field-error">{error.email[0]}</div>}
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Минимум 8 символов"
                        />
                        {error.password && <div className="field-error">{error.password[0]}</div>}
                    </div>

                    <div className="form-group">
                        <label>Подтверждение пароля</label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            placeholder="Повторите пароль"
                        />
                        {error.password2 && <div className="field-error">{error.password2[0]}</div>}
                    </div>

                    {error.non_field_errors && (
                        <div className="error-message">{error.non_field_errors[0]}</div>
                    )}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Уже есть аккаунт? <Link to="/login">Войдите</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;