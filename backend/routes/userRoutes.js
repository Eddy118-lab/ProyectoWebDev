const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controller/userController');
const uploadsUsers = require('../middleware/uploadsUsers'); // Importar el middleware de carga

// Rutas protegidas
router.get('/user/info', authMiddleware, userController.getUserInfo);
router.put('/user/update', authMiddleware, userController.updateUser);
router.delete('/user/delete', authMiddleware, userController.deleteUser);
router.put('/user/update/profile-picture', authMiddleware, uploadsUsers.single('fotoPerfil'), userController.updateProfilePicture); // Nueva ruta
router.get('/all', authMiddleware, userController.getAllUsersExceptLoggedIn);
router.get('/friends', authMiddleware, userController.getFriendsProfiles);

module.exports = router;
