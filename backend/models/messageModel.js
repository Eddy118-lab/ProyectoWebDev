const mongoose = require('mongoose');

// Definición del esquema para el modelo de mensaje
const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true, // No puede ser nulo
    },
    isRead: {
        type: Boolean,
        default: false, // Inicialmente no leído
    },
    sentAt: {
        type: Date,
        default: Date.now, // Fecha y hora de envío del mensaje
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que envía el mensaje
        required: true, // No puede ser nulo
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que recibe el mensaje
        required: true, // No puede ser nulo
    },
});

// Exportar el modelo
const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
