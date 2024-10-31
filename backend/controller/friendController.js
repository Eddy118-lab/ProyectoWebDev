const FriendModel = require('../models/friendModel');
const UserModel = require('../models/userModel');

// Controlador para enviar una solicitud de amistad
const sendFriendRequest = async (req, res) => {
    try {
        console.log('Enviando solicitud de amistad...');
        const { user2Id } = req.body;

        if (!user2Id) {
            console.log('ID del usuario al que se desea enviar la solicitud no proporcionado.');
            return res.status(400).json({ message: 'ID del usuario al que se desea enviar la solicitud no proporcionado.' });
        }

        const existingFriendship = await FriendModel.findOne({
            $or: [
                { user1Id: req.user._id, user2Id },
                { user1Id: user2Id, user2Id: req.user._id }
            ]
        });

        if (existingFriendship) {
            console.log('Ya son amigos o ya existe una solicitud de amistad.');
            return res.status(400).json({ message: 'Ya son amigos o ya existe una solicitud de amistad.' });
        }

        const newFriendship = new FriendModel({
            user1Id: req.user._id,
            user2Id,
        });

        const savedFriendship = await newFriendship.save();
        console.log('Solicitud de amistad enviada exitosamente:', savedFriendship);
        res.status(201).json({ message: 'Solicitud de amistad enviada exitosamente.', friendship: savedFriendship });
    } catch (error) {
        console.error('Error al enviar la solicitud de amistad:', error);
        res.status(500).json({ message: 'Error al enviar la solicitud de amistad.' });
    }
};

// Controlador para aceptar una solicitud de amistad
const acceptFriendRequest = async (req, res) => {
    try {
        console.log('Aceptando solicitud de amistad...');
        const { user2Id } = req.body;

        if (!user2Id) {
            console.log('ID del usuario a aceptar no proporcionado.');
            return res.status(400).json({ message: 'ID del usuario a aceptar no proporcionado.' });
        }

        const friendRequest = await FriendModel.findOne({
            user1Id: user2Id,
            user2Id: req.user._id,
        });

        if (!friendRequest) {
            console.log('No hay solicitud de amistad para aceptar.');
            return res.status(404).json({ message: 'No hay solicitud de amistad para aceptar.' });
        }

        await FriendModel.findOneAndDelete({
            user1Id: user2Id,
            user2Id: req.user._id,
        });

        const newFriendship = new FriendModel({
            user1Id: req.user._id,
            user2Id,
        });

        const savedFriendship = await newFriendship.save();
        console.log('Solicitud de amistad aceptada exitosamente:', savedFriendship);
        res.status(200).json({ message: 'Solicitud de amistad aceptada exitosamente.', friendship: savedFriendship });
    } catch (error) {
        console.error('Error al aceptar la solicitud de amistad:', error);
        res.status(500).json({ message: 'Error al aceptar la solicitud de amistad.' });
    }
};

// Controlador para eliminar una amistad
const removeFriend = async (req, res) => {
    try {
        console.log('Eliminando amistad...');
        const { user2Id } = req.body;

        if (!user2Id) {
            console.log('ID del usuario a eliminar no proporcionado.');
            return res.status(400).json({ message: 'ID del usuario a eliminar no proporcionado.' });
        }

        const deletedFriendship = await FriendModel.findOneAndDelete({
            $or: [
                { user1Id: req.user._id, user2Id },
                { user1Id: user2Id, user2Id: req.user._id }
            ]
        });

        if (!deletedFriendship) {
            console.log('No hay amistad para eliminar.');
            return res.status(404).json({ message: 'No hay amistad para eliminar.' });
        }

        console.log('Amistad eliminada exitosamente.');
        res.json({ message: 'Amistad eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la amistad:', error);
        res.status(500).json({ message: 'Error al eliminar la amistad.' });
    }
};

// Controlador para obtener la lista de amigos de un usuario
const getFriends = async (req, res) => {
    try {
        console.log('Obteniendo lista de amigos...');
        const friends = await FriendModel.find({
            $or: [
                { user1Id: req.user._id },
                { user2Id: req.user._id }
            ]
        }).populate('user1Id user2Id', 'nombreUsuario');

        console.log('Lista de amigos obtenida:', friends);
        res.json(friends);
    } catch (error) {
        console.error('Error al obtener la lista de amigos:', error);
        res.status(500).json({ message: 'Error al obtener la lista de amigos.' });
    }
};

// Controlador para obtener todos los usuarios excepto el actual
const getAllUsersExceptCurrent = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const users = await UserModel.find({ _id: { $ne: currentUserId } })
            .select('nombres apellidos nombreUsuario fotoPerfil')
            .exec();

        res.json(users);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios.' });
    }
};

// Controlador para buscar usuarios
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user._id;

        const users = await UserModel.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { $or: [{ nombres: new RegExp(query, 'i') }, { apellidos: new RegExp(query, 'i') }, { nombreUsuario: new RegExp(query, 'i') }] }
            ]
        }).select('nombres apellidos nombreUsuario fotoPerfil');

        res.json(users);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ message: 'Error al buscar usuarios.' });
    }
};

// Exportar las funciones del controlador
module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getFriends,
    getAllUsersExceptCurrent,
    searchUsers,
};
