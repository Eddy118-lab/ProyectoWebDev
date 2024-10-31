import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Form, Container, Row, Col, Dropdown } from 'react-bootstrap';
import './styles/StylePerfil.css';

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
    const [userPosts, setUserPosts] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        handleUpload(e.target.files[0]);
    };

    const handlePhotoClick = () => {
        document.getElementById("fileInput").click();
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
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

        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/post/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserPosts(response.data);
            } catch (error) {
                console.error('Error al obtener las publicaciones del usuario:', error);
            }
        };

        fetchUserInfo();
        fetchUserPosts();
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
            } catch (error) {
                console.error('Error al eliminar la cuenta del usuario:', error);
            }
        }
    };

    const handleUpload = async (selectedFile) => {
        const uploadData = new FormData();
        uploadData.append('fotoPerfil', selectedFile);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/feed/user/update/profile-picture', uploadData, {
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
            <Row className="d-flex justify-content-center" style={{ marginTop: '100px' }}>
                <Col md={3} className="text-center">
                    <Card.Img
                        variant="top"
                        src={userInfo.fotoPerfil || 'https://via.placeholder.com/150'}
                        className="rounded-circle mx-auto border border-secondary"
                        style={{ width: '150px', height: '150px', cursor: 'pointer' }}
                        alt="Foto de perfil"
                        onClick={handlePhotoClick}
                    />
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Col>
                <Col md={6}>
                    <h2>{userInfo.nombres} {userInfo.apellidos}</h2>
                    <p>@{userInfo.nombreUsuario}</p>
                    <p>Amigos: {userInfo.cantidadAmigos}</p>
                    <p>{userInfo.biografia || 'No disponible'}</p>
                    <div>
                        <Button variant="secondary" onClick={() => setEditing(!editing)} className="me-2">
                            {editing ? 'Cancelar' : 'Editar Perfil'}
                        </Button>
                        <Button variant="outline-secondary" onClick={handleDelete} className="me-2">
                            Eliminar Cuenta
                        </Button>
                        {editing && (
                            <Button variant="success" onClick={handleSave}>
                                Guardar Cambios
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {editing && (
                <Row className="mt-4">
                    <Col md={6} className="mx-auto">
                        <Form>
                            <Form.Group controlId="formNombreUsuario">
                                <Form.Label>Nombre de Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombreUsuario"
                                    value={formData.nombreUsuario}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBiografia">
                                <Form.Label>Biografía</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="biografia"
                                    value={formData.biografia}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formNumeroTelefono">
                                <Form.Label>Número de Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="numeroTelefono"
                                    value={formData.numeroTelefono}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Button variant="success" onClick={handleSave} className="mt-3">
                                Guardar Cambios
                            </Button>
                        </Form>
                    </Col>
                </Row>
            )}

            <Container className="mt-5">
                <h3>Mis Publicaciones</h3>
                {userPosts.length > 0 ? (
                    <Row>
                        {userPosts.map((post) => (
                            <Col key={post._id} xs={12} sm={6} md={4} className="mb-3">
                                <Card className="shadow-sm border-0">
                                    <Card.Header className="d-flex justify-content-between align-items-center bg-light border-0">
                                        <Dropdown align="end">
                                            <Dropdown.Toggle variant="link" className="text-muted p-0">
                                                <i className="fas fa-ellipsis-v"></i>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item as={Link} to={`/profile/user/edit/${post._id}`}>
                                                    Editar
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={handleDelete}>
                                                    Borrar
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Card.Header>
                                    {post.imagen_url && (
                                        <Card.Img variant="top" src={post.imagen_url} style={{ height: '300px', objectFit: 'cover' }} />
                                    )}
                                    <Card.Body>
                                        <Card.Text className="text-muted">
                                            {post.contenido || 'Descripción de la publicación'}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>No tienes publicaciones aún.</p>
                )}
            </Container>
        </Container>
    );
};

export default PerfilComponent;
