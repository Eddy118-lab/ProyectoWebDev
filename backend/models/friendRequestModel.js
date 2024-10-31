const mongoose = require('mongoose');

// Definición del esquema para el modelo de solicitud de amistad
const friendRequestSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'], // Enum con los estados de la solicitud
        required: true, // No puede ser nulo
        default: 'PENDING', // Valor inicial
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que envía la solicitud
        required: true, // No puede ser nulo
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que recibe la solicitud
        required: true, // No puede ser nulo
    },
});

// Exportar el modelo
const FriendRequestModel = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequestModel;
