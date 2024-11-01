const express = require('express');
const friendController = require('../controller/friendController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', authMiddleware, friendController.sendFriendRequest);

router.post('/respond', authMiddleware, friendController.respondToFriendRequest);

router.get('/requests', authMiddleware, friendController.getFriendRequests);

router.post('/delete', authMiddleware, friendController.DeleteFriend);

module.exports = router;

