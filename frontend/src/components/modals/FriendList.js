/////// NO BORRAR EL CODIGO ES SOPORTE
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const FriendListModal = () => {
    const [users, setUsers] = useState([]); // Estado para almacenar la lista de amigos
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    const token = localStorage.getItem('token');
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

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

    return (
        <div>
            <Button variant="primary" onClick={handleShowModal}>
                Ver Amigos
            </Button>

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
    );
};

export default FriendListModal;
