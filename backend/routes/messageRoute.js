const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas para la mensajería
router.post('/send', authMiddleware, messageController.sendMessage);
router.get('/inbox/:userId', authMiddleware, messageController.getInbox);
router.get('/sent/:userId', authMiddleware, messageController.getSentMessages);
router.patch('/read/:messageId', authMiddleware, messageController.markAsRead);
router.get('/feed', authMiddleware, messageController.getUsermessage);

module.exports = router;
