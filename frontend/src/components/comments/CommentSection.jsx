import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import './CommentSection.css';

const CommentSection = ({ recipeId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const { user, isAuthenticated, isAdmin } = useAuth();

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/comments/?recipe=${recipeId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Не удалось загрузить комментарии');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await api.post('/comments/', {
                recipe: recipeId,
                text: newComment.trim()
            });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Не удалось отправить комментарий');
        }
    };

    const handleEdit = async (commentId) => {
        try {
            await api.put(`/comments/${commentId}/`, {
                text: editText.trim()
            });
            setComments(comments.map(c =>
                c.id === commentId ? { ...c, text: editText.trim(), is_edited: true } : c
            ));
            setEditingComment(null);
            setEditText('');
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Не удалось обновить комментарий');
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот комментарий?')) return;

        try {
            await api.delete(`/comments/${commentId}/`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Не удалось удалить комментарий');
        }
    };

    const startEditing = (comment) => {
        setEditingComment(comment.id);
        setEditText(comment.text);
    };

    const cancelEditing = () => {
        setEditingComment(null);
        setEditText('');
    };

    if (loading) {
        return (
            <div className="comments-loading">
                <div className="loading-spinner-small"></div>
                <p>Загрузка комментариев...</p>
            </div>
        );
    }

    return (
        <div className="comments-section">
            <h3>💬 Комментарии ({comments.length})</h3>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Напишите комментарий..."
                        rows="3"
                        className="comment-input"
                    />
                    <button type="submit" className="comment-submit">
                        Отправить
                    </button>
                </form>
            ) : (
                <p className="comment-login-hint">
                    <a href="/login">Войдите</a>, чтобы оставить комментарий
                </p>
            )}

            {error && <div className="comments-error">{error}</div>}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">Пока нет комментариев. Будьте первым!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-author">
                                    <span className="author-name">{comment.author_name}</span>
                                    {comment.author_id === user?.id && (
                                        <span className="comment-badge">Вы</span>
                                    )}
                                    {isAdmin && comment.author_id !== user?.id && (
                                        <span className="comment-badge admin-badge">Админ</span>
                                    )}
                                </div>
                                <div className="comment-date">
                                    {new Date(comment.created_at).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    {comment.is_edited && (
                                        <span className="edited-badge">(отредактировано)</span>
                                    )}
                                </div>
                            </div>

                            {editingComment === comment.id ? (
                                <div className="comment-edit-form">
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        rows="3"
                                        className="comment-edit-input"
                                    />
                                    <div className="comment-edit-actions">
                                        <button
                                            onClick={() => handleEdit(comment.id)}
                                            className="btn-save-edit"
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="btn-cancel-edit"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="comment-text">{comment.text}</div>
                            )}

                            {(user?.id === comment.author_id || isAdmin) && !editingComment && (
                                <div className="comment-actions">
                                    {user?.id === comment.author_id && (
                                        <button
                                            onClick={() => startEditing(comment)}
                                            className="comment-action-btn edit-btn"
                                        >
                                            ✏️ Редактировать
                                        </button>
                                    )}
                                    {(isAdmin || user?.id === comment.author_id) && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="comment-action-btn delete-btn"
                                        >
                                            🗑️ Удалить
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;