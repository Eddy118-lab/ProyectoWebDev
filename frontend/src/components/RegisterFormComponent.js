import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { InputGroup, FormControl } from 'react-bootstrap';

const RegisterFormComponent = () => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correoElectronico: '',
        contrasena: '',
        fechaNacimiento: '',
        nombreUsuario: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5000/register/form', formData);
            setSuccessMessage(response.data.message);
            setFormData({
                nombres: '',
                apellidos: '',
                correoElectronico: '',
                contrasena: '',
                fechaNacimiento: '',
                nombreUsuario: '',
            });

            setTimeout(() => {
                navigate('/login/form');
            }, 2000); // Espera 2 segundos antes de redirigir
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error en el servidor. Por favor, inténtalo más tarde.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow" style={{ maxWidth: '700px', margin: '0 auto', borderRadius: '10px' }}>
                <h2 className="mb-4 text-center text-primary">Registro de Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="nombres"
                                placeholder="Nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="apellidos"
                                placeholder="Apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input
                                type="email"
                                className="form-control"
                                name="correoElectronico"
                                placeholder="Correo Electrónico"
                                value={formData.correoElectronico}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input
                                type="date"
                                className="form-control"
                                name="fechaNacimiento"
                                placeholder="Fecha de Nacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="nombreUsuario"
                                placeholder="Nombre de Usuario"
                                value={formData.nombreUsuario}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <InputGroup>
                                <FormControl
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    name="contrasena"
                                    placeholder="Contraseña"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required
                                />
                                <InputGroup.Text>
                                    <input
                                        type="checkbox"
                                        onChange={togglePasswordVisibility}
                                        checked={showPassword}
                                    />{' '}
                                    Mostrar
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                    <div className="text-center mt-3">
                        <span>¿Ya tienes cuenta? </span>
                        <Link to="/login/form" className="text-decoration-none text-primary fw-bold">Inicia sesión aquí</Link>
                    </div>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            </div>
        </div>
    );
};

export default RegisterFormComponent;
