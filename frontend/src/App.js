import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterFormComponent from './components/RegisterFormComponent';
import LoginFormComponent from './components/LoginFormComponent';
import Home from './components/home';
import PerfilComponent from './components/PerfilComponent'; // Asegúrate de crear este componente

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulación de autenticación; puedes reemplazar esto con una verificación de token
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register/form" element={<RegisterFormComponent />} />
        <Route path="/login/form" element={<LoginFormComponent setIsAuthenticated={setIsAuthenticated} />} />

        {/* Rutas privadas */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login/form" />}
        />
        <Route
          path="/feed/user/info"
          element={isAuthenticated ? <PerfilComponent /> : <Navigate to="/login/form" />}
        />

        {/* Ruta de inicio */}
        <Route path="/" element={<Navigate to="/login/form" />} />

        {/* Ruta para manejar entradas no válidas */}
        <Route path="*" element={<Navigate to="/login/form" />} />
      </Routes>
    </Router>
  );
}

export default App;
