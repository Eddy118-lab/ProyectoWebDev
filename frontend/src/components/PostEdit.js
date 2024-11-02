import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostEdit = () => {
    const { postId } = useParams(); // Obtiene el ID del post de la URL
    const [contenido, setContenido] = useState('');
    const [imagen, setImagen] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté guardado en el localStorage

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/post/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContenido(response.data.contenido);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el post:', error);
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, token]);

    const handleFileChange = (event) => {
        setImagen(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('contenido', contenido);
        if (imagen) {
            formData.append('imagen_url', imagen);
        }

        try {
            const response = await axios.put(`http://localhost:8000/post/edit/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            // Aquí puedes redirigir o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error al editar el post:', error);
        }
    };

    if (loading) return <p>Cargando publicación...</p>;

    return (
        <div>
            <h2>Editar Publicación</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escribe tu publicación aquí..."
                    required
                />
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Actualizar</button>
            </form>
        </div>
    );
};

export default PostEdit;
