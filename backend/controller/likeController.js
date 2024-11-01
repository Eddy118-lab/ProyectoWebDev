const LikeModel = require('../models/likeModel');
const PostModel = require('../models/postModel');

// Controlador para agregar un "like" a una publicación
const likePost = async (req, res) => {
    try {
        console.log('Intentando dar like a la publicación...');
        const { postId } = req.params;
        const userId = req.user._id;

        // Crear el like en la base de datos
        const newLike = await LikeModel.create({ post_id: postId, user_id: userId });
        console.log('Like agregado exitosamente:', newLike);
        res.status(201).json({ message: 'Like agregado exitosamente', like: newLike });
    } catch (error) {
        if (error.code === 11000) {
            console.log('El usuario ya ha dado like a esta publicación.');
            return res.status(400).json({ message: 'Ya has dado like a esta publicación' });
        }
        console.error('Error al dar like a la publicación:', error);
        res.status(500).json({ message: 'Error al dar like a la publicación.' });
    }
};

// Controlador para quitar un "like" de una publicación
const unlikePost = async (req, res) => {
    try {
        console.log('Intentando quitar like de la publicación...');
        const { postId } = req.params;
        const userId = req.user._id;

        // Eliminar el like de la base de datos
        const deletedLike = await LikeModel.findOneAndDelete({ post_id: postId, user_id: userId });
        if (!deletedLike) {
            console.log('Like no encontrado para esta publicación y usuario.');
            return res.status(404).json({ message: 'No se encontró like para eliminar' });
        }

        console.log('Like eliminado exitosamente:', deletedLike);
        res.json({ message: 'Like eliminado exitosamente' });
    } catch (error) {
        console.error('Error al quitar el like de la publicación:', error);
        res.status(500).json({ message: 'Error al quitar el like de la publicación.' });
    }
};

// Controlador para obtener todas las publicaciones a las que un usuario ha dado "like"
const getLikedPosts = async (req, res) => {
    try {
        console.log('Obteniendo publicaciones con like del usuario...');
        const userId = req.user._id;

        // Buscar todas las publicaciones que el usuario ha dado like
        const likedPosts = await LikeModel.find({ user_id: userId }).populate('post_id');
        console.log('Publicaciones con like obtenidas:', likedPosts);
        res.json(likedPosts);
    } catch (error) {
        console.error('Error al obtener publicaciones con like:', error);
        res.status(500).json({ message: 'Error al obtener publicaciones con like.' });
    }
};

module.exports = {
    likePost,
    unlikePost,
    getLikedPosts
};
