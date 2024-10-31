import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]); // Cambiado a 'users' para incluir todos los usuarios
    const [selectedUser, setSelectedUser] = useState(''); // Cambiado a 'selectedUser'
    const [messageContent, setMessageContent] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/messages/inbox/${userId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchUsers = async () => { // Cambiado a 'fetchUsers'
            try {
                const response = await axios.get('http://localhost:5000/messages/feed'); // Asume que tienes una ruta para obtener todos los usuarios
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchMessages();
        fetchUsers(); // Llama a la nueva función para obtener todos los usuarios
    }, [userId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/messages/send', {
                content: messageContent,
                senderId: userId,
                receiverId: selectedUser, // Cambiado a 'selectedUser'
            });
            setMessages([...messages, response.data]);
            setMessageContent('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h2>Bandeja de Entrada</h2>
            <ul>
                {messages.map((msg) => (
                    <li key={msg._id}>
                        <strong>{msg.senderId.username}:</strong> {msg.content} 
                        <small>{new Date(msg.sentAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            <h3>Enviar Mensaje</h3>
            <form onSubmit={handleSendMessage}>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                    <option value="">Selecciona un usuario</option>
                    {users.map(user => (
                        user._id !== userId && ( // Excluir al usuario actual de la lista
                            <option key={user._id} value={user._id}>{user.username}</option>
                        )
                    ))}
                </select>
                <textarea 
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)} 
                    placeholder="Escribe tu mensaje" 
                    required 
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default Inbox;
