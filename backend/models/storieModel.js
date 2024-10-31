const mongoose = require('mongoose');

// Definición del esquema para el modelo de historia
const storieSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true, // No puede ser nulo
    },
    imageUrl: {
        type: String,
        default: null, // Puede ser nulo, en caso de que no haya imagen
    },
    expiredAt: {
        type: Date,
        required: true, // Fecha de expiración de la historia
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al usuario que crea la historia
        required: true, // No puede ser nulo
    },
});

// Exportar el modelo
const StorieModel = mongoose.model('Storie', storieSchema);

module.exports = StorieModel;
