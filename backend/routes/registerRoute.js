// registerRoute.js
const express = require('express');
const { registerUser } = require('../controller/registerController'); // Ajusta la ruta según tu estructura
const verifyAge = require('../middleware/ageVerificationMiddleware'); // Ajusta la ruta según tu estructura

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/form', verifyAge, registerUser);

module.exports = router;
