import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendList = () => {
    const [users, setUsers] = useState([]);

    const token = localStorage.getItem('token');
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

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

        fetchUsers();
    }, []);

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

    return (
       <div className="container mt-5"> 
           <h2 className="titulo" style={{ marginTop: '10%' }}>Amigos</h2>
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
                                    className="btn btn-danger" // Cambiado a un botón de tipo 'danger'
                                    onClick={() => handleDeleteFriend(user._id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
       </div>
    );
};

export default FriendList;
