import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { FaRegHeart, FaRegComment, FaShare } from 'react-icons/fa'; // Agregamos algunos íconos

const PostComponent = () => {
    const [contenido, setContenido] = useState(''); // Texto de la publicación
    const [file, setFile] = useState(null); // Imagen opcional
    const [userPosts, setUserPosts] = useState([]); // Almacena las publicaciones del usuario
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el envío

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleChange = (e) => {
        setContenido(e.target.value);
    };

    const handleSubmitPost = async () => {
        if (!contenido && !file) {
            alert("Debes ingresar un comentario, una imagen o ambos para publicar.");
            return;
        }

        const token = localStorage.getItem('token');
        const postData = new FormData();
        postData.append('contenido', contenido);
        if (file) postData.append('imagen_url', file);

        setIsSubmitting(true); // Deshabilitar el botón al inicio de la solicitud
        try {
            const response = await axios.post('http://localhost:5000/post/create', postData, {
                headers: { Authorization: `Bearer ${token}`}
            });
            setUserPosts([response.data.post, ...userPosts]); // Añadir la nueva publicación al inicio
            setContenido(''); // Limpiar el contenido después de publicar
            setFile(null); // Limpiar archivo de imagen
        } catch (error) {
            console.error('Error al hacer el post:', error);
        } finally {
            setIsSubmitting(false); // Rehabilitar el botón después de la solicitud
        }
    };

    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/post/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
        } catch (error) {
            console.error('Error al cargar las publicaciones:', error);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, []);

    return (
        <Container className="mt-5">
            <Card className="shadow-sm mb-4"style={{marginTop: '100px'}}>
                <Card.Body>
                    <Form onSubmit={(e) => { e.preventDefault(); handleSubmitPost(); }}>
                        <Form.Group controlId="formContent">
                            <Form.Label className="fw-bold">¿Qué estás pensando?</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Escribe tu publicación..."
                                value={contenido}
                                onChange={handleChange}
                                className="border rounded-3"
                                style={{ resize: 'none' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mt-3">
                            <Form.Label className="fw-bold">Sube una imagen</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                className="border rounded-3"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                            {isSubmitting ? 'Publicando...' : 'Publicar'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Lista de publicaciones */}
            <div>
                {userPosts && userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <Card key={post.id} className="mb-3 shadow-sm">
                            <Card.Body>
                                <Row>
                                    <Col xs={2}>
                                        <img 
                                            src={post.user_id.fotoPerfil || 'default-profile.png'} 
                                            alt="Perfil" 
                                            className="rounded-circle" 
                                            style={{ width: '40px', height: '40px' }} 
                                        />
                                    </Col>
                                    <Col>
                                        <Card.Text className="fw-bold mb-1">{post.user_id.nombreUsuario}</Card.Text>
                                        <Card.Text>{post.contenido}</Card.Text>
                                        {post.imagen_url && (
                                            <Card.Img 
                                                src={post.imagen_url} 
                                                alt="Imagen de publicación" 
                                                style={{ borderRadius: '10px', height: 'auto', maxHeight: '400px', objectFit: 'cover' }} 
                                            />
                                        )}
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between mt-2">
                                    <span>
                                        <FaRegHeart className="me-2" style={{ cursor: 'pointer' }} />
                                        <FaRegComment className="me-2" style={{ cursor: 'pointer' }} />
                                        <FaShare style={{ cursor: 'pointer' }} />
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted text-center">No hay publicaciones para mostrar.</p>
                )}
            </div>
        </Container>
    );
};

export default PostComponent;
