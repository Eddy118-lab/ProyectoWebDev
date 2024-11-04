import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            } catch (error) {
                console.error('Error al cargar solicitudes de amistad', error);
            }
        };

        fetchFriendRequests();
    }, []);

    const handleSendRequest = async (targetUserId) => {
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
        <div className="container py-5">
            <h1 className="text-center mb-5" style={{
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                color: 'white',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                marginTop: '80px',
            }}>
                Conecta con Amigos
            </h1>

            <h2 className="mb-4" style={{ color: '#cc2366' }}>Explorar Usuarios</h2>
            <div className="row g-4">
                {users.map(user => (
                    <div key={user._id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-lg border-0 rounded-lg">
                            <div className="card-img-top text-center py-4">
                                <img
                                    src={user.fotoPerfil}
                                    alt={`${user.nombreUsuario}'s profile`}
                                    className="rounded-circle"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #e6683c' }}
                                />
                            </div>
                            <div className="card-body text-center">
                                <h5 className="card-title" style={{ color: '#bc1888', fontWeight: 'bold' }}>{user.nombreUsuario}</h5>
                                <button
                                    className="btn w-100 mt-3"
                                    onClick={() => handleSendRequest(user._id)}
                                    style={{
                                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    Enviar Solicitud
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="my-5" style={{ color: '#dc2743' }}>Solicitudes Enviadas</h2>
            <div className="row g-4">
                {sentRequests.map(request => (
                    <div key={request._id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-lg border-0 rounded-lg">
                            <div className="card-img-top text-center py-4">
                                <img
                                    src={request.user2Id.fotoPerfil}
                                    alt={`${request.user2Id.nombreUsuario}'s profile`}
                                    className="rounded-circle"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #f09433' }}
                                />
                            </div>
                            <div className="card-body text-center">
                                <h5 className="card-title" style={{ color: '#e6683c', fontWeight: 'bold' }}>{request.user2Id.nombreUsuario}</h5>
                                <p className="card-text" style={{ color: '#dc2743' }}>Estado: {request.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="my-5" style={{ color: '#f09433' }}>Solicitudes Recibidas</h2>
            <div className="row g-4">
                {receivedRequests.map(request => (
                    <div key={request._id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-lg border-0 rounded-lg">
                            <div className="card-img-top text-center py-4">
                                <img
                                    src={request.user1Id.fotoPerfil}
                                    alt={`${request.user1Id.nombreUsuario}'s profile`}
                                    className="rounded-circle"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #dc2743' }}
                                />
                            </div>
                            <div className="card-body text-center">
                                <h5 className="card-title" style={{ color: '#e6683c', fontWeight: 'bold' }}>{request.user1Id.nombreUsuario}</h5>
                                <div className="d-flex justify-content-around mt-3">
                                    <button
                                        className="btn"
                                        onClick={() => handleRespondRequest(request._id, 'accepted')}
                                        style={{
                                            background: '#f09433',
                                            color: 'white',
                                            border: 'none',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => handleRespondRequest(request._id, 'rejected')}
                                        style={{
                                            background: '#dc2743',
                                            color: 'white',
                                            border: 'none',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendRequests;
