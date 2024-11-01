const mongoose = require('mongoose');

// Definición del esquema para el modelo de "Like"
const likeSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Relación con el modelo de Post
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relación con el modelo de Usuario
        required: true
    },
});

// Crear un índice compuesto para evitar que un usuario dé "like" a la misma publicación más de una vez
likeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

const LikeModel = mongoose.model('Like', likeSchema);

module.exports = LikeModel;
