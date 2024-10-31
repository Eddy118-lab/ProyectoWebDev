const mongoose = require('mongoose');

// Definición del esquema para el modelo de like
const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que dio el like
        required: true, // No puede ser nulo
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Referencia al post al que se le dio el like
        required: true, // No puede ser nulo
    },
});

// Exportar el modelo
const LikeModel = mongoose.model('Like', likeSchema);

module.exports = LikeModel;
