const CommentModel = require('../models/commentModel');
const PostModel = require('../models/postModel');

const commentController = {
    createComment: async (req, res) => {
        const { content, postId } = req.body;
        const userId = req.userId;

        // Validación de entrada
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'El contenido del comentario no puede estar vacío.' });
        }

        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            if (!userId) {
                return res.status(400).json({ message: 'userId no proporcionado' });
            }

            const newComment = new CommentModel({ content, userId, postId });
            await newComment.save();

            res.status(201).json({ message: 'Comentario agregado', comment: newComment });
        } catch (error) {
            console.error('Error al crear el comentario:', error);
            res.status(500).json({ message: 'Error al crear el comentario', error });
        }
    },

    getCommentsByPost: async (req, res) => {
        const { postId } = req.query;
        console.log('Solicitud para obtener comentarios del post:', postId);
    
        try {
            if (!postId) {
                console.log('Falta el ID del post en la solicitud');
                return res.status(400).json({ message: 'Se requiere el ID del post' });
            }
    
            console.log('Buscando comentarios en la base de datos...');
            const comments = await CommentModel.find({ postId })
                .populate('userId', 'nombreUsuario fotoPerfil') // Esto traerá el nombre de usuario para cada comentario
                .sort({ createdAt: -1 });
    
            console.log('Comentarios encontrados:', comments); // Mostrar todos los comentarios encontrados
            
            if (comments.length > 0) {
                console.log('Enviando comentarios al cliente');
                res.status(200).json(comments);
            } else {
                console.log('No se encontraron comentarios para el post con ID:', postId);
                res.status(404).json({ message: 'No se encontraron comentarios para este post' });
            }
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
            res.status(500).json({ message: 'Error al obtener comentarios', error });
        }
    },
    

    updateComment: async (req, res) => {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        // Validación de entrada
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'El contenido del comentario no puede estar vacío.' });
        }

        try {
            const comment = await CommentModel.findOne({ _id: commentId, userId });
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado o no autorizado' });
            }

            comment.content = content;
            await comment.save();

            res.status(200).json({ message: 'Comentario actualizado', comment });
        } catch (error) {
            console.error('Error al actualizar comentario:', error);
            res.status(500).json({ message: 'Error al actualizar comentario', error });
        }
    },

    deleteComment: async (req, res) => {
        const { commentId } = req.params;
        const userId = req.userId;

        try {
            const comment = await CommentModel.findOneAndDelete({ _id: commentId, userId });
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado o no autorizado' });
            }

            res.status(200).json({ message: 'Comentario eliminado' });
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            res.status(500).json({ message: 'Error al eliminar comentario', error });
        }
    }
};

module.exports = commentController;
