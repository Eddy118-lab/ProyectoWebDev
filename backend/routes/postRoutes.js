const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const uploadsPost = require('../middleware/uploadsPosts'); // Middleware para la subida de imágenes
const postController = require('../controller/postController');

router.post('/create', authMiddleware, uploadsPost.single('imagen_url'), postController.createPost);
router.get('/user', authMiddleware, postController.getUserPosts);
router.get('/feed', authMiddleware, postController.getOtherUserPosts);
router.put('/update/:id', authMiddleware, uploadsPost.single('imagen_url'), postController.updatePost);
router.delete('/delete/:id', authMiddleware, postController.deletePost);

module.exports = router;