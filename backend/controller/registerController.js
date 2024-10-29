const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

// Controlador para manejar el registro de usuarios
const registerUser = async (req, res) => {
    // Desestructuración de los datos del cuerpo de la solicitud
    const {
        nombres,
        apellidos,
        correoElectronico,
        contrasena,
        fechaNacimiento,
        nombreUsuario,
    } = req.body;

    try {
        // Validar campos obligatorios
        if (!nombres || !apellidos || !correoElectronico || !contrasena || !fechaNacimiento || !nombreUsuario) {
            return res.status(400).json({ message: 'Por favor, complete todos los campos obligatorios.' });
        }

        // Comprobar si el correo electrónico o nombre de usuario ya existen
        const existingUser = await UserModel.findOne({
            $or: [{ correoElectronico }, { nombreUsuario }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico o el nombre de usuario ya están en uso.' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Crear un nuevo usuario
        const newUser = new UserModel({
            nombres,
            apellidos,
            correoElectronico,
            contrasena: hashedPassword, // Almacenar la contraseña hasheada
            fechaNacimiento,
            nombreUsuario,
        });

        // Guardar el usuario en la base de datos
        await newUser.save();
        return res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Exportar el controlador
module.exports = {
    registerUser,
};