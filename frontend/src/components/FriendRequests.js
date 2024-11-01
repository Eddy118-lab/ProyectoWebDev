import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequests = () => {
    const [users, setUsers] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    const token = localStorage.getItem('token');
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/feed/all', authHeader);
                setUsers(response.data);
                console.log('Usuarios cargados:', response.data); // Agregado
            } catch (error) {
                console.error('Error al cargar usuarios', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/friends/requests', authHeader);
                setSentRequests(response.data.sentRequests);
                setReceivedRequests(response.data.receivedRequests);
                console.log('Solicitudes de amistad recibidas:', response.data); // Agregado
            } catch (error) {
                console.error('Error al cargar solicitudes de amistad', error);
            }
        };

        fetchFriendRequests();
    }, []);

    const handleSendRequest = async (targetUserId) => {
        console.log('ID del usuario autenticado:', token); // Agregado para verificar el token
        console.log('ID del usuario objetivo:', targetUserId); // Agregado para verificar el ID del usuario objetivo

        try {
            await axios.post('http://localhost:5000/friends/send', { targetUserId }, authHeader);
            alert('Solicitud de amistad enviada');
        } catch (error) {
            console.error('Error al enviar solicitud de amistad', error);
        }
    };

    const handleRespondRequest = async (requestId, action) => {
        try {
            await axios.post('http://localhost:5000/friends/respond', { requestId, action }, authHeader);
            alert(`Solicitud de amistad ${action}`);
        } catch (error) {
            console.error(`Error al ${action} solicitud de amistad`, error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="titutlo" style={{ marginTop: '10%' }}>Enviar Solicitudes de Amistad</h2>
            <div className="row">
                {users.map(user => (
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
                                    className="btn btn-primary"
                                    onClick={() => handleSendRequest(user._id)}
                                >
                                    Enviar Solicitud
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="my-4">Solicitudes Enviadas</h2>
            <div className="row">
                {sentRequests.map(request => (
                    <div key={request._id} className="col-md-4 mb-3">
                        <div className="card text-center">
                            <img
                                src={request.user2Id.fotoPerfil}
                                alt={`${request.user2Id.nombreUsuario}'s profile`}
                                className="card-img-top rounded-circle mx-auto mt-3"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{request.user2Id.nombreUsuario}</h5>
                                <p className="card-text">Estado: {request.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="my-4">Solicitudes Recibidas</h2>
            <div className="row">
                {receivedRequests.map(request => (
                    <div key={request._id} className="col-md-4 mb-3">
                        <div className="card text-center">
                            <img
                                src={request.user1Id.fotoPerfil}
                                alt={`${request.user1Id.nombreUsuario}'s profile`}
                                className="card-img-top rounded-circle mx-auto mt-3"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{request.user1Id.nombreUsuario}</h5>
                                <button
                                    className="btn btn-success mx-2"
                                    onClick={() => handleRespondRequest(request._id, 'accepted')}
                                >
                                    Aceptar
                                </button>
                                <button
                                    className="btn btn-danger mx-2"
                                    onClick={() => handleRespondRequest(request._id, 'rejected')}
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendRequests;
