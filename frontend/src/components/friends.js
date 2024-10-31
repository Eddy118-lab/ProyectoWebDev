import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const socket = io('http://localhost:5000'); // Cambia esto según tu configuración

const FriendsComponent = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Función para enviar solicitud de amistad
    const sendFriendRequest = (userId) => {
        socket.emit('sendFriendRequest', { userId });
    };

    // Función para eliminar amigo
    const removeFriend = (userId) => {
        socket.emit('removeFriend', { userId });
    };

    // Función para buscar amigos
    const searchFriends = () => {
        socket.emit('searchFriends', { query: searchQuery });
    };

    useEffect(() => {
        // Escuchar eventos del servidor
        socket.on('friendRequestSent', (data) => {
            alert(data.message);
        });

        socket.on('friendRemoved', (data) => {
            alert(data.message);
        });

        socket.on('friendsList', (data) => {
            setUsers(data);
        });

        return () => {
            socket.off('friendRequestSent');
            socket.off('friendRemoved');
            socket.off('friendsList');
        };
    }, []);

    return (
        <Container className="mt-5">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar amigos..."
                onKeyPress={(e) => e.key === 'Enter' && searchFriends()}
            />
            <Row>
                {users.length > 0 ? (
                    users.map((user) => (
                        <Col md={4} key={user._id} className="mb-4">
                            <Card className="text-center">
                                <Card.Img
                                    variant="top"
                                    src={user.fotoPerfil || 'https://via.placeholder.com/150'}
                                    className="rounded-circle mx-auto mt-3"
                                    style={{ width: '150px', height: '150px' }}
                                    alt="Foto de perfil"
                                />
                                <Card.Body>
                                    <Card.Title>{user.nombres} {user.apellidos}</Card.Title>
                                    <Card.Text>@{user.nombreUsuario}</Card.Text>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => sendFriendRequest(user._id)}
                                    >
                                        Enviar Solicitud de Amistad
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => removeFriend(user._id)}
                                        className="ml-2"
                                    >
                                        Eliminar Amigo
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No hay usuarios disponibles para enviar solicitudes de amistad.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default FriendsComponent;
