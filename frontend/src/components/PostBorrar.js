import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostDelete = () => {
    const { postId } = useParams(); // Obtiene el ID del post de la URL
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté guardado en el localStorage
    const navigate = useNavigate(); // Para redirigir después de la eliminación

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/post/`, { // Cambiado para incluir el postId
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPost(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar la publicación:', error);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId, token]);

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.')) {
            try {
                await axios.delete(`http://localhost:5000/post/delete/`, { // Cambiado para incluir el postId
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Publicación eliminada exitosamente.');
                navigate('/profile/user/info'); // Redirige a la página de perfil después de eliminar
            } catch (error) {
                console.error('Error al eliminar la publicación:', error);
                alert('Error al eliminar la publicación.'); // Alerta al usuario en caso de error
            }
        }
    };

    if (loading) return <p>Cargando publicación...</p>;

    return (
        <div className="container mt-5" style={{ marginTop: '100px' }}>
            <h2 className="mb-4">Eliminar Publicación</h2>
            {post ? (
                <div>
                    <p><strong>Contenido:</strong> {post.contenido}</p>
                    {post.imagen_url && <img src={post.imagen_url} alt="Imagen del post" className="img-fluid mb-3" />}
                    <button className="btn btn-danger" onClick={handleDelete}>Eliminar Publicación</button>
                </div>
            ) : (
                <p>La publicación no existe o no se pudo cargar.</p>
            )}
        </div>
    );
};

export default PostDelete;