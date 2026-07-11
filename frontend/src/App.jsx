import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/global.css';
import './App.css';

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <div className="container">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Защищенные маршруты */}
                  <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <div className="profile-page">
                            <h2>Личный кабинет</h2>
                            <p>Здесь будет профиль пользователя</p>
                          </div>
                        </PrivateRoute>
                      }
                  />

                  {/* Маршруты администратора */}
                  <Route
                      path="/recipes/create"
                      element={
                        <PrivateRoute requireAdmin>
                          <div className="admin-page">
                            <h2>Создать рецепт</h2>
                            <p>Здесь будет форма создания рецепта</p>
                          </div>
                        </PrivateRoute>
                      }
                  />

                  <Route
                      path="/recipes/:id/edit"
                      element={
                        <PrivateRoute requireAdmin>
                          <div className="admin-page">
                            <h2>Редактировать рецепт</h2>
                            <p>Здесь будет форма редактирования рецепта</p>
                          </div>
                        </PrivateRoute>
                      }
                  />

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;