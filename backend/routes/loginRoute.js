const express = require('express');
const { loginUser } = require('../controller/loginController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para iniciar sesión
router.post('/auth/form', loginUser);

// Ruta protegida (ejemplo)
router.get('/api/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Acceso concedido a la red social', user: req.user });
});

module.exports = router;
