const mongoose = require('mongoose');

// Definición del esquema para el modelo de comentario
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true, // No puede ser nulo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que hizo el comentario
        required: true, // No puede ser nulo
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Referencia al post al que pertenece el comentario
        required: true, // No puede ser nulo
    },
});

// Exportar el modelo
const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
