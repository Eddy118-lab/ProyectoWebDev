const LikeModel = require('../models/likeModel');
const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel'); // Asegúrate de tener el modelo de usuario

// Controlador para manejar los likes
const likeController = {
    // Función para dar like a un post
    addLike: async (req, res) => {
        const { post_id } = req.body;
        const user_id = req.user.id; // ID del usuario autenticado

        try {
            console.log(`Intentando agregar like: usuario ${user_id}, post ${post_id}`);

            // Verificar si ya existe el like
            const existingLike = await LikeModel.findOne({ post_id, user_id });
            if (existingLike) {
                console.log('Like ya existe para este post y usuario.');
                return res.status(400).json({ message: 'Ya diste like a esta publicación.' });
            }

            // Crear el like
            const newLike = new LikeModel({ post_id, user_id });
            await newLike.save();
            console.log('Nuevo like guardado en la base de datos.');

            // Incrementar el contador de likes en el post
            await PostModel.findByIdAndUpdate(post_id, { $inc: { likeCount: 1 } });
            console.log(`Contador de likes incrementado para el post ${post_id}`);

            res.status(201).json({ message: 'Like agregado correctamente.' });
        } catch (error) {
            console.error('Error al agregar el like:', error);
            res.status(500).json({ message: 'Error al agregar el like.' });
        }
    },

    // Función para quitar like de un post
    removeLike: async (req, res) => {
        const { post_id } = req.body;
        const user_id = req.user.id;

        try {
            console.log(`Intentando quitar like: usuario ${user_id}, post ${post_id}`);

            const like = await LikeModel.findOne({ post_id, user_id });
            if (!like) {
                console.log('No se encontró un like existente para este post y usuario.');
                return res.status(400).json({ message: 'No has dado like a esta publicación.' });
            }

            await like.deleteOne();
            console.log('Like eliminado de la base de datos.');

            await PostModel.findByIdAndUpdate(post_id, { $inc: { likeCount: -1 } });
            console.log(`Contador de likes decrementado para el post ${post_id}`);

            res.status(200).json({ message: 'Like eliminado correctamente.' });
        } catch (error) {
            console.error('Error al eliminar el like:', error);
            res.status(500).json({ message: 'Error al eliminar el like.' });
        }
    },

    // Función para obtener información de los likes de un post
    getLikesInfo: async (req, res) => {
        const { post_id } = req.params;

        try {
            console.log(`Obteniendo información de likes para el post ${post_id}`);

            // Encontrar todos los likes asociados al post
            const likes = await LikeModel.find({ post_id }).populate('user_id', 'nombreUsuario');

            // Extraer los nombres de usuario
            const userNames = likes.map(like => like.user_id.nombreUsuario);
            console.log(`Usuarios que dieron like: ${userNames}`);

            // Contar el total de likes
            const likeCount = likes.length;
            console.log(`Total de likes para el post ${post_id}: ${likeCount}`);

            res.status(200).json({ likeCount, userNames });
        } catch (error) {
            console.error('Error al obtener la información de likes:', error);
            res.status(500).json({ message: 'Error al obtener la información de likes.' });
        }
    }
};

module.exports = likeController;
