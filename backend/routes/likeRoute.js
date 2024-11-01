const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const likeController = require('../controller/likeController');

// Rutas protegidas para "like"
router.post('/:postId', authMiddleware, likeController.likePost); // Dar like a una publicación
router.delete('/:postId', authMiddleware, likeController.unlikePost); // Quitar like de una publicación
router.get('/posts', authMiddleware, likeController.getLikedPosts); // Obtener publicaciones con like del usuario

module.exports = router;
