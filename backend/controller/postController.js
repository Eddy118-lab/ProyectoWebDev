const PostModel = require('../models/postModel');
const FriendModel = require('../models/friendModel');
const LikeModel = require('../models/likeModel')
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

const getFriendsPosts = async (req, res) => {
    try {
        console.log('Obteniendo publicaciones de amigos...');

        // Obtener el ID del usuario logueado
        const loggedInUserId = req.user._id;
        console.log('ID del usuario logueado:', loggedInUserId);

        // Obtener IDs de amigos
        const friends = await FriendModel.find({
            $or: [
                { user1Id: loggedInUserId, status: 'accepted' },
                { user2Id: loggedInUserId, status: 'accepted' }
            ]
        }).lean();

        console.log('Amigos encontrados:', friends);

        const friendIds = friends.map(friend =>
            friend.user1Id.toString() === loggedInUserId.toString() ? friend.user2Id : friend.user1Id
        );

        console.log('IDs de amigos:', friendIds);

        // Obtener publicaciones de amigos
        const friendPosts = await PostModel.find({ user_id: { $in: friendIds } })
            .populate('user_id', '-contrasena') // Excluir contraseña del usuario
            .lean();

        console.log('Publicaciones de amigos encontradas:', friendPosts);

        // Obtener likes para todas las publicaciones de amigos en una sola consulta
        const postIds = friendPosts.map(post => post._id);
        console.log('IDs de publicaciones:', postIds);

        const likes = await LikeModel.find({ post_id: { $in: postIds } })
            .populate('user_id', 'nombreUsuario')
            .lean();

        console.log('Likes encontrados:', likes);

        // Agrupar likes por post
        const likesByPostId = likes.reduce((acc, like) => {
            const postId = like.post_id.toString();
            if (!acc[postId]) {
                acc[postId] = [];
            }
            acc[postId].push(like.user_id.nombreUsuario);
            return acc;
        }, {});

        console.log('Likes agrupados por publicación:', likesByPostId);

        // Agregar los likes a cada publicación
        for (const post of friendPosts) {
            post.likes = likesByPostId[post._id.toString()] ? likesByPostId[post._id.toString()].length : 0; // Total de likes
            post.likeUsers = likesByPostId[post._id.toString()] || []; // Obtener el nombre de usuario de cada like
        }

        console.log('Publicaciones de amigos con likes agregados:', friendPosts);
        res.json(friendPosts);
    } catch (error) {
        console.error('Error al obtener publicaciones de amigos:', error);
        res.status(500).json({ message: 'Error al obtener publicaciones de amigos.' });
    }
};


// Actualizar un post específico
const updatePost = async (req, res) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const { contenido } = req.body;
        let { imagen_url } = req.body;

        // Verifica si se proporciona una imagen
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'posts' });
            imagen_url = result.secure_url; // URL segura de Cloudinary
        }

        // Validar que al menos un campo se proporciona
        if (!contenido && !imagen_url) {
            return res.status(400).json({ message: 'No se proporcionó ningún campo para actualizar.' });
        }

        // Actualizar la publicación del usuario
        const updatedPost = await PostModel.findOneAndUpdate(
            { user_id: userId },
            { contenido, imagen_url },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Publicación no encontrada.' });
        }

        res.json({ message: 'Publicación actualizada exitosamente.', post: updatedPost });
    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        res.status(500).json({ message: 'Error al actualizar la publicación.' });
    }
};



const deletePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.body; // Recibimos el ID del post y el ID del usuario

        if (!id) {
            console.log('ID de la publicación no proporcionado');
            return res.status(400).json({ error: 'Se requiere el ID de la publicación para eliminarla' });
        }

        console.log('ID de la publicación a eliminar:', id); // Verificar el ID recibido

        const post = await PostModel.findById(id);
        console.log('Resultado de la búsqueda de la publicación:', post); // Log de la publicación encontrada o null

        if (!post) {
            console.log('Publicación no encontrada');
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }

        console.log('Publicación encontrada:', post);

        // Verificar el usuario que intenta eliminar
        console.log('ID del usuario que intenta eliminar:', userId);
        console.log('ID del usuario propietario del post:', post.user_id.toString());

        if (post.user_id.toString() !== userId) {
            console.log('Permiso denegado para el usuario:', userId);
            return res.status(403).json({ error: 'No tienes permisos para eliminar este post' });
        }

        await PostModel.findByIdAndDelete(id);
        console.log('Publicación eliminada con éxito, ID:', id);
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
