const express = require('express');
const { loginUser } = require('../controller/loginController');

const router = express.Router();

// Ruta para iniciar sesión
router.post('/auth/form', loginUser);

module.exports = router;
