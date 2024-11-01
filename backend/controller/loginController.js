const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Controlador para manejar el inicio de sesión de usuarios
const loginUser = async (req, res) => {
    const { correoElectronico, contrasena, recaptchaResponse } = req.body;

    try {
        // Validar campos obligatorios
        if (!correoElectronico || !contrasena || !recaptchaResponse) {
            return res.status(400).json({ message: 'Por favor, complete todos los campos obligatorios.' });
        }

        // Verificar ReCAPTCHA
        const secretKey = '6LcYB24qAAAAAHSqtbNlzupMhtiWWi99XE5Ed-jA'; // Reemplaza con tu clave secreta de ReCAPTCHA
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

        const response = await axios.post(verificationUrl);
        const { success } = response.data;

        if (!success) {
            return res.status(400).json({ message: 'La verificación de ReCAPTCHA falló. Inténtalo de nuevo.' });
        }

        // Buscar el usuario en la base de datos
        const user = await UserModel.findOne({ correoElectronico });

        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas. El correo electrónico no se encuentra.' });
        }

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas. La contraseña es incorrecta.' });
        }

        // Establecer la verificación en true
        user.verificacion = true;
        await user.save();

        // Generar un token de acceso
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

        return res.status(200).json({ message: 'Inicio de sesión exitoso.', token, user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Exportar el controlador
module.exports = {
    loginUser,
};

