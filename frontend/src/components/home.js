import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [showLikedPosts, setShowLikedPosts] = useState(false);
    const [showSavedPosts, setShowSavedPosts] = useState(false);

    // Función para obtener las publicaciones desde el servidor
    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/post/feed', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const updatedPosts = response.data.map(post => ({
                ...post,
                liked: post.liked || false,
                saved: post.saved || false,
            }));
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Actualizar el estado de like en el servidor
    const updateLikeOnServer = async (postId, liked) => {
        try {
            await axios.post(`http://localhost:5000/post/${postId}/like`, { liked }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Error al actualizar el like:', error);
        }
    };

    // Actualizar el estado de guardado en el servidor
    const updateSaveOnServer = async (postId, saved) => {
        try {
            await axios.post(`http://localhost:5000/post/${postId}/save`, { saved }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Error al actualizar el guardado:', error);
        }
    };

    // Manejar el like en una publicación
    const handleLike = async (postId) => {
        const updatedPosts = posts.map(post => {
            if (post._id === postId) {
                const newLikedStatus = !post.liked;
                const newLikesCount = newLikedStatus ? post.likes + 1 : post.likes - 1;
                return { ...post, liked: newLikedStatus, likes: newLikesCount };
            }
            return post;
        });
        setPosts(updatedPosts);

        const liked = updatedPosts.find(post => post._id === postId).liked;
        await updateLikeOnServer(postId, liked);
    };

    // Manejar el guardado en una publicación
    const handleSave = async (postId) => {
        const updatedPosts = posts.map(post => {
            if (post._id === postId) {
                return { ...post, saved: !post.saved };
            }
            return post;
        });
        setPosts(updatedPosts);

        const saved = updatedPosts.find(post => post._id === postId).saved;
        await updateSaveOnServer(postId, saved);
    };

    // Filtrar publicaciones que tienen like o están guardadas
    const likedPosts = posts.filter(post => post.liked);
    const savedPosts = posts.filter(post => post.saved);

    // Seleccionar las publicaciones a mostrar en base a los filtros
    const displayedPosts = showLikedPosts ? likedPosts : showSavedPosts ? savedPosts : posts;

    // Manejar el retorno a todas las publicaciones
    const handleGoHome = () => {
        setShowLikedPosts(false);
        setShowSavedPosts(false);
    };

    return (
        <div>
            <Header
                onLikeClick={() => setShowLikedPosts(prev => !prev)}
                onSaveClick={() => setShowSavedPosts(prev => !prev)}
                onHomeClick={handleGoHome}
            />
            <div className="container mt-5 pt-5">
                <h2 className="my-4 text-center" style={{ color: '#343a40' }}>
                    {showLikedPosts ? 'Publicaciones a las que diste Like' : showSavedPosts ? 'Publicaciones Guardadas' : 'Publicaciones de otros usuarios'}
                </h2>

                {displayedPosts.length > 0 ? (
                    <div className="row justify-content-center">
                        {displayedPosts.map(post => (
                            <div key={post._id} className="col-md-8 mb-4">
                                <div className="card shadow-sm border-0" style={{ maxHeight: '600px' }}>
                                    <div className="card-header d-flex align-items-center">
                                        <img
                                            src={post.user_id.fotoPerfil || 'default-profile.png'}
                                            alt="Profile"
                                            className="rounded-circle me-2"
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                        />
                                        <h5 className="mb-0">{post.user_id.nombreUsuario}</h5>
                                    </div>
                                    {post.imagen_url && (
                                        <img
                                            src={post.imagen_url}
                                            alt="Post"
                                            className="card-img-top rounded"
                                            style={{ objectFit: 'cover', height: '250px', width: '100%' }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <p className="card-text" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                                            {post.contenido}
                                        </p>
                                        <div className="d-flex justify-content-between">
                                            <span>
                                                <i
                                                    className={`fa${post.liked ? 's' : 'r'} fa-heart me-2 text-danger`}
                                                    onClick={() => handleLike(post._id)}
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                                {post.likes} Me gusta
                                                <i className="far fa-comment me-2 ms-3" style={{ cursor: 'pointer' }}></i>
                                                <i className="far fa-paper-plane" style={{ cursor: 'pointer' }}></i>
                                            </span>
                                            <i
                                                className={`fa${post.saved ? 's' : 'r'} fa-bookmark`}
                                                onClick={() => handleSave(post._id)}
                                                style={{ cursor: 'pointer' }}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted text-center">No hay publicaciones disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
