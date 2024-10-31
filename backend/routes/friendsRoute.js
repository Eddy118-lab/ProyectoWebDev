const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const friendsController = require('../controller/friendsController'); // Importa el controlador de amigos

// Rutas para gestionar amigos
router.get('/friends/all', authMiddleware, friendsController.getAllUsersExceptCurrent); // Obtener todos los usuarios excepto el actual
router.post('/friends/request', authMiddleware, friendsController.sendFriendRequest); // Enviar solicitud de amistad
router.get('/friends/requests', authMiddleware, friendsController.getPendingRequests); // Obtener solicitudes de amistad pendientes

module.exports = router;
