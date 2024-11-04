const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const uploadsPost = require('../middleware/uploadsPosts'); // Middleware para la subida de imágenes
const postController = require('../controller/postController');

router.post('/create', authMiddleware, uploadsPost.single('imagen_url'), postController.createPost);
router.get('/user', authMiddleware, postController.getUserPosts);
router.get('/feed', authMiddleware, postController.getFriendsPosts);
router.put('/update', authMiddleware, uploadsPost.single('imagen_url'), postController.updatePost);
router.delete('/delete', authMiddleware, postController.deletePost);

module.exports = router;

//el controllador requiere el id del usuario autenticado