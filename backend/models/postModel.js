const mongoose = require('mongoose');

// Definición del esquema para el modelo de post
const postSchema = new mongoose.Schema({
    contenido: {
        type: String,
        default: null, // Puede ser nulo
    },
    imagen_url: {
        type: String,
        default: null, // Puede ser nulo
    },
    likeCount: { 
        type: Number, 
        default: 0 
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Hace referencia al modelo User
        required: true, // No puede ser nulo
    },
    fechaCreacion: {
        type: Date,
        default: Date.now, // Fecha de creación por defecto
    }
});

// Exportar el modelo
const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
