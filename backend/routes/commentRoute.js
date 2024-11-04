const express = require('express');
const commentController = require('../controller/commentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para crear un comentario
router.post('/create', authMiddleware, commentController.createComment);

// Ruta para obtener todos los comentarios de un post específico
router.get('/show', authMiddleware, commentController.getCommentsByPost);

// Ruta para actualizar un comentario específico
router.put('/update/:commentId', authMiddleware, commentController.updateComment);

// Ruta para eliminar un comentario específico
router.delete('/delete/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
