import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostEdit = () => {
    const { postId } = useParams(); // Obtiene el ID del post de la URL
    const [contenido, setContenido] = useState('');
    const [imagen, setImagen] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté guardado en el localStorage
    const navigate = useNavigate(); // Para redirigir después de la actualización

    useEffect(() => {
        const fetchPosts = async () => {
            console.log('Iniciando la carga de publicaciones del usuario...');
            try {
                // Obtener todas las publicaciones del usuario autenticado
                const response = await axios.get(`http://localhost:5000/post/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Respuesta de publicaciones del usuario:', response.data);

                // Filtrar la publicación específica que coincide con el `postId`
                const post = response.data.posts.find((p) => p._id === postId);

                if (post) {
                    console.log('Publicación encontrada:', post);
                    setContenido(post.contenido);
                } else {
                    console.error('Publicación no encontrada.');
                    navigate('/profile/user/info'); // Redirige si no se encuentra la publicación
                }

                setLoading(false);
            } catch (error) {
                console.error('Error al obtener las publicaciones del usuario:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [postId, token, navigate]);

    const handleFileChange = (event) => {
        setImagen(event.target.files[0]);
        console.log('Imagen seleccionada:', event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        if (contenido) formData.append('contenido', contenido);
        if (imagen) formData.append('imagen_url', imagen);

        console.log('Datos enviados en la actualización:', { contenido, imagen });

        try {
            // Realizar la solicitud de actualización de la publicación
            const response = await axios.put(`http://localhost:5000/post/update/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Respuesta de la actualización:', response.data);
            navigate('/profile/user/info'); // Redirige después de la actualización
        } catch (error) {
            console.error('Error al editar el post:', error);
        }
    };

    if (loading) return <p>Cargando publicación...</p>;

    return (
        <div className="container mt-5" style={{ marginTop: '100px' }}>
            <h2 className="mb-4" style={{ marginTop: '100px' }}>Editar Publicación</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        className="form-control mb-3"
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        placeholder="Escribe tu publicación aquí..."
                        required
                    />
                </div>
                <div className="form-group">
                    <input type="file" className="form-control mb-3" onChange={handleFileChange} accept="image/*" />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar</button>
            </form>
        </div>
    );
};

export default PostEdit;
