const mongoose = require('mongoose');

// Definición del esquema para el modelo de seguimiento
const followSchema = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que sigue
        required: true, // No puede ser nulo
    },
    followedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que es seguido
        required: true, // No puede ser nulo
    },
});

// Exportar el modelo
const FollowModel = mongoose.model('Follow', followSchema);

module.exports = FollowModel;