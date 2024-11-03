const express = require('express');
const likeController = require('../controller/likeController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware de autenticación
const router = express.Router();

// Ruta para dar like a un post
router.post('/add', authMiddleware, likeController.addLike);

// Ruta para quitar like de un post
router.delete('/remove', authMiddleware, likeController.removeLike);

// Ruta para obtener información de los likes de un post específico
router.get('/info/:post_id', authMiddleware, likeController.getLikesInfo);

module.exports = router;
