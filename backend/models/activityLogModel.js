const mongoose = require('mongoose');

// Definición del esquema para el modelo de registro de actividad
const activityLogSchema = new mongoose.Schema({
    activityType: {
        type: String,
        enum: ['LIKE', 'COMMENT', 'POST', 'FRIEND_REQUEST', 'FOLLOW', 'MENTION'], // Enum con los tipos de actividad
        required: true, // No puede ser nulo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que realiza la actividad
        required: true, // No puede ser nulo
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario objetivo de la actividad, si aplica
        default: null, // Puede ser nulo
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Referencia a un post en caso de que la actividad esté relacionada con uno
        default: null, // Puede ser nulo
    },
});

// Exportar el modelo
const ActivityLogModel = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLogModel;
