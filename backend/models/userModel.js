const mongoose = require('mongoose');

// Definición del esquema para el modelo de usuario
const userSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: true, // No puede ser nulo
    },
    apellidos: {
        type: String,
        required: true, // No puede ser nulo
    },
    correoElectronico: {
        type: String,
        required: true, // No puede ser nulo
        unique: true, // Debe ser único
        match: [/.+@.+\..+/, 'Por favor, ingrese un correo electrónico válido'], // Validación de formato de correo
    },
    contrasena: {
        type: String,
        required: true, // No puede ser nulo
    },
    fechaNacimiento: {
        type: Date,
        required: true, // No puede ser nulo
    },
    nombreUsuario: {
        type: String,
        required: true, // No puede ser nulo
        unique: true, // Debe ser único
    },
    numeroTelefono: {
        type: String,
        default: null, // Puede ser nulo
    },
    fotoPerfil: {
        type: String,
        default: null, // Puede ser nulo
    },
    biografia: {
        type: String,
        default: null, // Puede ser nulo
    },
    genero: {
        type: String,
        default: null, // Puede ser nulo
    },
    cantidadAmigos: {
        type: Number,
        default: 0, // Inicialmente 0 amigos
    },
    verificacion: {
        type: Boolean,
        default: false, // Inicialmente no verificado
    },
});

// Exportar el modelo
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;