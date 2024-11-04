import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Form, Container, Row, Col, Dropdown, Modal } from 'react-bootstrap'; // Asegúrate de incluir Modal aquí
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

    //////ayuda al modal  de amigos
    const [users, setUsers] = useState([]); // Estado para almacenar la lista de amigos
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    // Estado para el modal de imagen ampliada
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    const token = localStorage.getItem('token');
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    //////////////

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        handleUpload(e.target.files[0]);
    };

    const handlePhotoClick = () => {
        document.getElementById("fileInput").click();
    };

    // Función para manejar el clic en la imagen para ampliarla
    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
        setShowImageModal(true);
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

    /////// ayuda modal de amigos
    // Función para obtener la lista de amigos
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/feed/friends', authHeader);
                setUsers(response.data);
                console.log('Usuarios cargados:', response.data);
            } catch (error) {
                console.error('Error al cargar usuarios', error);
            }
        };

        fetchUsers(); // Llamada a la API para cargar los amigos al iniciar el componente
    }, []);

    // Función para eliminar un amigo
    const handleDeleteFriend = async (friendId) => {
        try {
            const response = await axios.post('http://localhost:5000/friends/delete', { targetUserId: friendId }, authHeader);
            console.log(`Amistad eliminada:`, response.data.message);
            alert(`Amistad eliminada correctamente`);

            // Actualizar la lista de amigos después de eliminar
            setUsers(users.filter(user => user._id !== friendId));
        } catch (error) {
            console.error(`Error al eliminar amistad`, error);
            alert(`Error al eliminar amistad: ${error.response?.data.message || 'Error desconocido'}`);
        }
    };

    // Funciones para abrir y cerrar el modal
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    ///////

    // Función para cerrar el modal de imagen
    const handleCloseImageModal = () => setShowImageModal(false);


    const handleDeletePost = async (postId) => {
        console.log("Intentando eliminar la publicación con ID:", postId);
        
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta publicación?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token'); 
                console.log("Token obtenido:", token);
    
                const response = await axios.delete('http://localhost:5000/post/delete', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: { id: postId } 
                });
    
                console.log("Respuesta de eliminación:", response);
    
                setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
                console.log("Publicación eliminada. Nuevas publicaciones del usuario:", userPosts);
    
                alert('Publicación eliminada exitosamente');
            } catch (error) {
                console.error('Error al eliminar la publicación:', error);
                alert('Error al eliminar la publicación');
            }
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
                    <p style={{ cursor: 'pointer', color: 'blue' }} onClick={handleShowModal}>
                        Amigos: {userInfo.cantidadAmigos}
                    </p>
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

            <div>
                {/* Modal para mostrar la lista de amigos */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Lista de Amigos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container mt-3">
                            <div className="row">
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <div key={user._id} className="col-md-4 mb-3">
                                            <div className="card text-center">
                                                <img
                                                    src={user.fotoPerfil}
                                                    alt={`${user.nombreUsuario}'s profile`}
                                                    className="card-img-top rounded-circle mx-auto mt-3"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                                <div className="card-body">
                                                    <h5 className="card-title">{user.nombreUsuario}</h5>
                                                    <button
                                                        className="btn btn-danger" // Cambiado a un botón de tipo 'danger'
                                                        onClick={() => handleDeleteFriend(user._id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No tienes amigos para mostrar.</p>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

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
                                                <Dropdown.Item onClick={() => handleDeletePost(post._id)}>
                                                    Borrar
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Card.Header>
                                    {post.imagen_url && (
                                        <Card.Img
                                            variant="top"
                                            src={post.imagen_url}
                                            style={{ height: '300px', objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => handleImageClick(post.imagen_url)} // Manejar clic en la imagen
                                        />
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

            {/* Modal para la imagen ampliada */}
            <Modal show={showImageModal} onHide={handleCloseImageModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Imagen Ampliada</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img src={currentImage} alt="Imagen ampliada" className="img-fluid" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseImageModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PerfilComponent;