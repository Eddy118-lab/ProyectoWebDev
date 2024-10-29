import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Row, Col, Container } from 'react-bootstrap';

const PerfilComponent = () => {
    const [userInfo, setUserInfo] = useState({});
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        numeroTelefono: '',
        biografia: '',
        genero: '',
        fechaNacimiento: '',
        verificacion: false,
    });
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        // Obtener la información del usuario
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token'); // Ajusta según cómo almacenes el token
                const response = await axios.get('http://localhost:5000/feed/user/info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data);
                setFormData({
                    nombreUsuario: response.data.nombreUsuario,
                    numeroTelefono: response.data.numeroTelefono || '',
                    biografia: response.data.biografia || '',
                    genero: response.data.genero || '',
                    fechaNacimiento: response.data.fechaNacimiento || '',
                    verificacion: response.data.verificacion || false,
                });
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/feed/user/update', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserInfo({ ...userInfo, ...formData });
            setEditing(false);
        } catch (error) {
            console.error('Error al actualizar la información del usuario:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/feed/user/delete', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Cuenta eliminada exitosamente.');
                // Redireccionar o cerrar sesión aquí
            } catch (error) {
                console.error('Error al eliminar la cuenta del usuario:', error);
            }
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('fotoPerfil', file);
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/feed/user/update/profile-picture', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setUserInfo(response.data.user);
            alert('Foto de perfil actualizada exitosamente.');
        } catch (error) {
            console.error('Error al actualizar la foto de perfil:', error);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="text-center">
                <Card.Img
                    variant="top"
                    src={userInfo.fotoPerfil || 'https://via.placeholder.com/150'}
                    className="rounded-circle mx-auto mt-3"
                    style={{ width: '150px', height: '150px' }}
                    alt="Foto de perfil"
                />
                <Card.Body>
                    <Card.Title>{userInfo.nombres} {userInfo.apellidos}</Card.Title>
                    <Card.Text>@{userInfo.nombreUsuario}</Card.Text>
                    <Card.Text>Amigos: {userInfo.cantidadAmigos}</Card.Text>
                    <Card.Text>{userInfo.biografia || 'No disponible'}</Card.Text>

                    <div>
                        <Button variant="primary" onClick={() => setEditing(!editing)}>
                            {editing ? 'Cancelar' : 'Editar Perfil'}
                        </Button>
                        <Button variant="danger" onClick={handleDelete} className="ml-2">
                            Eliminar Cuenta
                        </Button>
                    </div>
                </Card.Body>

                {editing && (
                    <Card.Footer>
                    <Form>
                        {/* ... tus campos de formulario existentes ... */}
                        <Form.Group controlId="formFotoPerfil">
                            <Form.Label>Foto de Perfil</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpload} className="mt-3">
                            Subir Foto de Perfil
                        </Button>
                    </Form>
                </Card.Footer>
                )}
            </Card>
        </Container>
    );
};

export default PerfilComponent;
