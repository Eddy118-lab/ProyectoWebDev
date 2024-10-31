const mongoose = require('mongoose');

// Definición del esquema para el modelo de amigo
const friendSchema = new mongoose.Schema({
    user1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia a uno de los usuarios en la relación de amistad
        required: true, // No puede ser nulo
    },
    user2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al otro usuario en la relación de amistad
        required: true, // No puede ser nulo
    },
});

// Exportar el modelo
const FriendModel = mongoose.model('Friend', friendSchema);

module.exports = FriendModel;
