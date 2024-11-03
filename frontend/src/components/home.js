import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

     // Obtener las publicaciones con el estado "liked" desde la base de datos
     const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/post/feed', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data);
            const updatedPosts = response.data.map(post => ({
                ...post,
                liked: post.liked || false, // `liked` indica si el usuario ya ha dado "like"
                likeUsers: post.likeUsers || [],
                likes: post.likes || 0
            }));
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
            setError("Error al cargar las publicaciones.");
        } finally {
            setLoading(false);
        }
    };

    // Alternar el "like" en el frontend y sincronizar con la BD
    const handleLike = async (postId, alreadyLiked) => {
        try {
            if (!alreadyLiked) {
                await axios.post(`http://localhost:5000/likes/add`, { post_id: postId }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                // Actualiza el estado localmente
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post._id === postId ? { ...post, liked: true, likes: post.likes + 1 } : post
                    )
                );
            } else {
                await axios.post(`http://localhost:5000/likes/remove`, { post_id: postId }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                // Actualiza el estado localmente
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post._id === postId ? { ...post, liked: false, likes: post.likes - 1 } : post
                    )
                );
            }
        } catch (error) {
            console.error("Error al actualizar el like:", error);
            setError("Hubo un problema al actualizar el like.");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const renderLikeText = (likeUsers) => {
        if (!likeUsers || likeUsers.length === 0) {
            return "No hay me gusta todavía";
        }
        if (likeUsers.length === 1) {
            return `${likeUsers[0]} dio me gusta`;
        }
        if (likeUsers.length === 2) {
            return `${likeUsers[0]} y ${likeUsers[1]} dieron me gusta`;
        }
        return `${likeUsers[0]}, ${likeUsers[1]} y otros dieron me gusta`;
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
            <Header />
            <div className="container mt-5 pt-5">
                <h2 className="my-4 text-center" style={{ color: '#343a40' }}>
                    Publicaciones de tus amigos
                </h2>
                {loading ? (
                    <p className="text-muted text-center">Cargando publicaciones...</p>
                ) : posts.length > 0 ? (
                    <div className="row justify-content-center">
                        {posts.map(post => (
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
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>
                                                <i
                                                    className={`fa${post.liked ? 's' : 'r'} fa-heart me-2 text-danger`}
                                                    onClick={() => handleLike(post._id, post.liked)}
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                                {post.likes} Me gusta
                                            </span>
                                            <span className="text-muted ms-2">
                                                {renderLikeText(post.likeUsers)}
                                            </span>
                                            <span>
                                                <i className="far fa-comment me-2 ms-3" style={{ cursor: 'pointer' }}></i>
                                                <i className="far fa-paper-plane" style={{ cursor: 'pointer' }}></i>
                                            </span>
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
