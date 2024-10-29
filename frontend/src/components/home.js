import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/feed/user/info'); // Redirige a la ruta del perfil
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
                <h4 className="text-center mt-3">Menú</h4>
                <ul className="list-unstyled ps-3">
                    <li className="my-2">
                        <button className="btn btn-outline-primary w-100" onClick={handleProfileClick}>
                            Perfil
                        </button>
                    </li>
                    {/* Otras opciones adicionales */}
                    <li className="my-2">
                        <button className="btn btn-outline-secondary w-100" disabled>
                            Opción X
                        </button>
                    </li>
                    <li className="my-2">
                        <button className="btn btn-outline-secondary w-100" disabled>
                            Opción Y
                        </button>
                    </li>
                </ul>
            </div>

            {/* Contenido Principal */}
            <div className="container mt-5 text-center">
                <h1>Bienvenido</h1>
                <p>Explora las opciones en el menú lateral para acceder a distintas secciones.</p>
            </div>
        </div>
    );
};

export default Home;
