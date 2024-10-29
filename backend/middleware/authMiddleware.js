const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Acceso denegado: Formato de token incorrecto o no presente.');
        return res.status(401).json({ message: 'Acceso denegado. Formato de token incorrecto o no presente.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET desde .env
        console.log('Token verificado:', verified);

        req.user = await UserModel.findById(verified.id);

        if (!req.user || !req.user.verificacion) {
            console.log('Acceso denegado: El usuario no está verificado.');
            return res.status(403).json({ message: 'Acceso denegado. El usuario no está verificado.' });
        }

        console.log('Usuario autenticado:', req.user);
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.log('Token inválido o mal formado.');
            return res.status(400).json({ message: 'Token inválido o mal formado.' });
        }
        console.error('Error en el middleware de autenticación:', error);
        res.status(500).json({ message: 'Error de servidor en la autenticación.' });
    }
};

module.exports = authMiddleware;
