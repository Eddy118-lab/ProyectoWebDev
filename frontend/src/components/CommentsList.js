import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CommentsSection = () => {
    const { postId } = useParams(); // Extraer postId de la URL
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    // Cargar comentarios cuando el componente se monta
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/comments/show', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { postId }
                });
                console.log(response.data); // Verificar la respuesta de la API
                setComments(response.data);
            } catch (error) {
            }
        };
    
        fetchComments();
    }, [postId]);
    

    // Manejar el envío del formulario para crear un comentario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!content.trim()) {
            setError('El comentario no puede estar vacío.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/comments/create',
                { content, postId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                const newComment = {
                    _id: response.data.comment._id,
                    content: response.data.comment.content,
                    userId: {
                        nombreUsuario: response.data.comment.userId.nombreUsuario,
                        profilePic: response.data.comment.userId.profilePic // Asegúrate de que la API devuelva la URL de la foto de perfil
                    }
                };

                setComments((prevComments) => [newComment, ...prevComments]);
                setContent(''); // Limpiar el campo después de enviar
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al crear el comentario');
        }
    };

    return (
        <div className="container my-4" style={{ marginTop: '5%', maxWidth: '600px' }}>
            <h2 className="mb-4" style={{ color: '#E1306C' }}>Comentarios</h2>

            {/* Muestra la lista de comentarios */}
            <ul className="list-group mb-4" style={{ borderRadius: '10px', backgroundColor: '#FDF5F5' }}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <li key={comment._id} className="list-group-item border-0" style={{ display: 'flex', alignItems: 'center', padding: '15px' }}>
                            <img
                                src={
                                    comment.userId.fotoPerfil && comment.userId.fotoPerfil.trim() !== ''
                                        ? `${comment.userId.fotoPerfil}?t=${new Date().getTime()}` // Agrega un sufijo para evitar caché
                                        : 'https://via.placeholder.com/40'
                                }
                                alt="Foto de perfil"
                                className="rounded-circle me-3"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                                <strong style={{ color: '#E1306C' }}>{comment.userId.nombreUsuario}</strong>
                                <p className="mb-1" style={{ color: '#262626' }}>{comment.content}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item border-0 text-center" style={{ color: '#999' }}>No hay comentarios aún.</li>
                )}
            </ul>

            <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-control"
                        placeholder="Escribe tu comentario..."
                        rows="3"
                        style={{ borderRadius: '10px', borderColor: '#E1306C' }}
                        required
                    />
                </div>
                <button type="submit" className="btn" style={{ backgroundColor: '#E1306C', color: 'white', borderRadius: '20px' }}>Enviar comentario</button>
            </form>
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default CommentsSection;
