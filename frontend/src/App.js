import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterFormComponent from './components/RegisterFormComponent';
import LoginFormComponent from './components/LoginFormComponent';
import Home from './components/home';
import PerfilComponent from './components/PerfilComponent';
import PostComponent from './components/PostComponent';
import Header from './components/Header';
import Inbox from './components/inbox';
import FriendRequests from './components/FriendRequests';
import PostEdit from './components/PostEdit';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Verifica si hay un token y establece el estado de autenticación
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    setIsAuthenticated(false); // Cambiar el estado de autenticación
  };

  return (
    <Router>
      {/* Renderiza el Header solo si el usuario está autenticado */}
      {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/register/form" element={<RegisterFormComponent />} />
        <Route path="/login/form" element={<LoginFormComponent setIsAuthenticated={setIsAuthenticated} />} />

        {/* Rutas privadas */}
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/profile/user/info" element={<PerfilComponent />} />
            <Route path="/post/user" element={<PostComponent />} />
            <Route path="/profile/user/edit/:id" element={<PostEdit />} />
            <Route path="/amigos" element={<FriendRequests />} />
            <Route path="/chat" element={<Inbox />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login/form" />} />
        )}

        {/* Ruta de inicio */}
        <Route path="/" element={<Navigate to="/login/form" />} />
      </Routes>
    </Router>
  );
}

export default App;
