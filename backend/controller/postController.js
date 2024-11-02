const PostModel = require('../models/postModel');
const FriendModel = require('../models/friendModel');
const cloudinary = require('../config/cloudinaryConfig');

// Crear un nuevo post
const createPost = async (req, res) => {
    try {
        const { contenido } = req.body; // Solo se espera contenido del cuerpo
        const userId = req.user.id; // Suponiendo que `req.user.id` contiene el ID del usuario autenticado

        // Subir imagen a Cloudinary si existe
        let imagen_url = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'posts', // Carpeta donde se almacenarán las imágenes
            });
            imagen_url = result.secure_url; // Obtiene la URL segura de la imagen
        }

        // Crear un nuevo post
        const newPost = new PostModel({
            contenido,
            imagen_url,
            user_id: userId
        });

        await newPost.save();
        res.status(201).json({ message: 'Post creado exitosamente', post: newPost });
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
};

// Obtener posts de un usuario específico (para perfil)
const getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await PostModel.find({ user_id: userId }).populate('user_id', 'nombreUsuario fotoPerfil');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener los posts del usuario:', error);
        res.status(500).json({ error: 'Error al obtener los posts del usuario' });
    }
};

// Controlador para obtener publicaciones de amigos
const getFriendsPosts = async (req, res) => {
    try {
        console.log('Obteniendo publicaciones de amigos...');

        // Obtener el ID del usuario logueado
        const loggedInUserId = req.user._id;

        // Obtener IDs de amigos
        const friends = await FriendModel.find({
            $or: [
                { user1Id: loggedInUserId, status: 'accepted' },
                { user2Id: loggedInUserId, status: 'accepted' }
            ]
        }).lean();

        const friendIds = friends.map(friend =>
            friend.user1Id.toString() === loggedInUserId.toString() ? friend.user2Id : friend.user1Id
        );

        // Obtener publicaciones de amigos
        const friendPosts = await PostModel.find({ user_id: { $in: friendIds } })
            .populate('user_id', '-contrasena') // Excluir contraseña del usuario
            .lean();

        console.log('Publicaciones de amigos obtenidas:', friendPosts);
        res.json(friendPosts);
    } catch (error) {
        console.error('Error al obtener publicaciones de amigos:', error);
        res.status(500).json({ message: 'Error al obtener publicaciones de amigos.' });
    }
};


// Actualizar un post específico
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido } = req.body; // No se requiere imagen_url para actualizar
        const post = await PostModel.findById(id);

        // Verificar permisos
        if (post.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar este post' });
        }

        // Actualizar contenido y manejar nueva imagen si existe
        post.contenido = contenido || post.contenido;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'posts',
            });
            post.imagen_url = result.secure_url; // Actualiza la URL de la imagen
        }

        await post.save();
        res.status(200).json({ message: 'Post actualizado exitosamente', post });
    } catch (error) {
        console.error('Error al actualizar el post:', error);
        res.status(500).json({ error: 'Error al actualizar el post' });
    }
};

// Eliminar un post específico
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id);

        // Verificar permisos
        if (post.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este post' });
        }

        await post.remove();
        res.status(200).json({ message: 'Post eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        res.status(500).json({ error: 'Error al eliminar el post' });
    }
};

module.exports = {
    createPost,
    getUserPosts,
    getFriendsPosts,
    updatePost,
    deletePost
};
