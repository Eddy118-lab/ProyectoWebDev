const mongoose = require('mongoose');

// Definición del esquema para el modelo de notificación
const notificationSchema = new mongoose.Schema({
    notificationType: {
        type: String,
        enum: ['LIKE', 'COMMENT', 'FRIEND_REQUEST', 'FOLLOW', 'MENTION'], // Enum con los tipos de notificación
        required: true, // No puede ser nulo
    },
    isRead: {
        type: Boolean,
        default: false, // Inicialmente no leída
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que recibe la notificación
        required: true, // No puede ser nulo
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que genera la notificación
        required: true, // No puede ser nulo
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Referencia a un post en caso de que la notificación esté relacionada con uno
        default: null, // Puede ser nulo
    },
});

// Exportar el modelo
const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
