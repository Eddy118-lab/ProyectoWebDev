const FollowModel = require('../models/followModel');

// Controlador para seguir a un usuario
const followUser = async (req, res) => {
    try {
        console.log('Siguiendo al usuario...'); // Log de inicio
        const { followedId } = req.body; // ID del usuario a seguir

        // Validar que se proporcione un ID para seguir
        if (!followedId) {
            console.log('ID del usuario a seguir no proporcionado.');
            return res.status(400).json({ message: 'ID del usuario a seguir no proporcionado.' });
        }

        // Verificar si ya se está siguiendo al usuario
        const existingFollow = await FollowModel.findOne({
            followerId: req.user._id,
            followedId,
        });

        if (existingFollow) {
            console.log('Ya sigues a este usuario.');
            return res.status(400).json({ message: 'Ya sigues a este usuario.' });
        }

        // Crear un nuevo seguimiento
        const newFollow = new FollowModel({
            followerId: req.user._id,
            followedId,
        });

        const savedFollow = await newFollow.save();
        console.log('Usuario seguido exitosamente:', savedFollow); // Log de éxito
        res.status(201).json({ message: 'Usuario seguido exitosamente.', follow: savedFollow });
    } catch (error) {
        console.error('Error al seguir al usuario:', error);
        res.status(500).json({ message: 'Error al seguir al usuario.' });
    }
};

// Controlador para dejar de seguir a un usuario
const unfollowUser = async (req, res) => {
    try {
        console.log('Dejando de seguir al usuario...'); // Log de inicio
        const { followedId } = req.body; // ID del usuario a dejar de seguir

        // Validar que se proporcione un ID para dejar de seguir
        if (!followedId) {
            console.log('ID del usuario a dejar de seguir no proporcionado.');
            return res.status(400).json({ message: 'ID del usuario a dejar de seguir no proporcionado.' });
        }

        // Eliminar el seguimiento
        const deletedFollow = await FollowModel.findOneAndDelete({
            followerId: req.user._id,
            followedId,
        });

        if (!deletedFollow) {
            console.log('No sigues a este usuario.');
            return res.status(404).json({ message: 'No sigues a este usuario.' });
        }

        console.log('Usuario dejado de seguir exitosamente.'); // Log de éxito
        res.json({ message: 'Usuario dejado de seguir exitosamente.' });
    } catch (error) {
        console.error('Error al dejar de seguir al usuario:', error);
        res.status(500).json({ message: 'Error al dejar de seguir al usuario.' });
    }
};

// Controlador para obtener la lista de seguidores de un usuario
const getFollowers = async (req, res) => {
    try {
        console.log('Obteniendo lista de seguidores...'); // Log de inicio
        const followers = await FollowModel.find({ followedId: req.user._id }).populate('followerId', 'nombreUsuario');

        console.log('Lista de seguidores obtenida:', followers); // Log de la lista de seguidores
        res.json(followers);
    } catch (error) {
        console.error('Error al obtener la lista de seguidores:', error);
        res.status(500).json({ message: 'Error al obtener la lista de seguidores.' });
    }
};

// Controlador para obtener la lista de usuarios seguidos por el usuario
const getFollowing = async (req, res) => {
    try {
        console.log('Obteniendo lista de usuarios seguidos...'); // Log de inicio
        const following = await FollowModel.find({ followerId: req.user._id }).populate('followedId', 'nombreUsuario');

        console.log('Lista de usuarios seguidos obtenida:', following); // Log de la lista de seguidos
        res.json(following);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios seguidos:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios seguidos.' });
    }
};

// Exportar las funciones del controlador
module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};
