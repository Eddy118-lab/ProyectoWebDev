import React, { useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginFormComponent = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        correoElectronico: '',
        contrasena: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Captura la ubicación desde donde el usuario intentó navegar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5000/login/auth/form', {
                ...formData,
                recaptchaResponse: recaptchaToken,
            });

            const { token } = response.data;

            // Guardar el token en localStorage
            localStorage.setItem('token', token);

            setSuccessMessage(response.data.message);
            setIsAuthenticated(true); // Cambiar el estado de autenticación

            // Navegar a la ubicación anterior o a la página principal
            const { state } = location;
            navigate(state?.from || '/home'); // Redirige a la ubicación anterior o a /home
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error en el servidor. Por favor, inténtalo más tarde.');
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <h2 className="text-center text-primary mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="correoElectronico" className="form-label fw-bold">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            name="correoElectronico"
                            id="correoElectronico"
                            placeholder="Ingresa tu correo electrónico"
                            value={formData.correoElectronico}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contrasena" className="form-label fw-bold">Contraseña</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                name="contrasena"
                                id="contrasena"
                                placeholder="Ingresa tu contraseña"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required
                            />
                            <span className="input-group-text">
                                <input
                                    type="checkbox"
                                    onChange={togglePasswordVisibility}
                                    checked={showPassword}
                                    aria-label="Mostrar contraseña"
                                /> Mostrar
                            </span>
                        </div>
                    </div>
                    <div className="mb-3 d-flex justify-content-center">
                        <ReCAPTCHA
                            sitekey="6LcYB24qAAAAAK9loyhfYVouEDElZIwtibRZzWAT"
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2">Iniciar Sesión</button>
                    <div className="text-center mt-3">
                        <span>¿No tienes cuenta? </span>
                        <Link to="/register/form" className="text-decoration-none text-primary fw-bold">Regístrate aquí</Link>
                    </div>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            </div>
        </div>
    );
};

export default LoginFormComponent;
