import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import RegisterFormComponent from './components/RegisterFormComponent';
import LoginFormComponent from './components/LoginFormComponent';
import Home from './components/home';
import PerfilComponent from './components/PerfilComponent';
import PostComponent from './components/PostComponent';
import Header from './components/Header';
import FriendRequests from './components/FriendRequests';
import PostEdit from './components/PostEdit';
import CommentsList from './components/CommentsList';

function SaveLastValidRoute() {
  const location = useLocation();
  useEffect(() => {
    localStorage.setItem('lastValidRoute', location.pathname);
  }, [location]);

  return null;
}

function RedirectToLastValidRoute({ isAuthenticated }) {
  const navigate = useNavigate(); // Asegúrate de que useNavigate esté importado
  useEffect(() => {
    if (isAuthenticated) {
      const lastValidRoute = localStorage.getItem('lastValidRoute') || '/home';
      navigate(lastValidRoute);
    }
  }, [isAuthenticated, navigate]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastValidRoute');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />}
      <SaveLastValidRoute />
      <RedirectToLastValidRoute isAuthenticated={isAuthenticated} />
      
      <Routes>
        <Route path="/register/form" element={<RegisterFormComponent />} />
        <Route path="/login/form" element={<LoginFormComponent setIsAuthenticated={setIsAuthenticated} />} />

        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/profile/user/info" element={<PerfilComponent />} />
            <Route path="/post/user" element={<PostComponent />} />
            <Route path="/profile/user/edit/:id" element={<PostEdit />} />
            <Route path="/amigos" element={<FriendRequests />} />
            <Route path="/comments/:postId" element={<CommentsList />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login/form" />} />
        )}

        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
