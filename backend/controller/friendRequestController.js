const FriendRequestModel = require('../models/friendRequestModel');

// Controlador para enviar una solicitud de amistad
const sendFriendRequest = async (req, res) => {
    try {
        console.log('Enviando solicitud de amistad...'); // Log de inicio
        const { receiverId } = req.body; // ID del usuario que recibirá la solicitud

        // Validar que se proporcione un ID para el receptor
        if (!receiverId) {
            console.log('ID del usuario receptor no proporcionado.');
            return res.status(400).json({ message: 'ID del usuario receptor no proporcionado.' });
        }

        // Verificar si ya existe una solicitud de amistad
        const existingRequest = await FriendRequestModel.findOne({
            senderId: req.user._id,
            receiverId,
        });

        if (existingRequest) {
            console.log('Ya has enviado una solicitud de amistad a este usuario.');
            return res.status(400).json({ message: 'Ya has enviado una solicitud de amistad a este usuario.' });
        }

        // Crear una nueva solicitud de amistad
        const newRequest = new FriendRequestModel({
            senderId: req.user._id,
            receiverId,
        });

        const savedRequest = await newRequest.save();
        console.log('Solicitud de amistad enviada exitosamente:', savedRequest); // Log de éxito
        res.status(201).json({ message: 'Solicitud de amistad enviada exitosamente.', request: savedRequest });
    } catch (error) {
        console.error('Error al enviar la solicitud de amistad:', error);
        res.status(500).json({ message: 'Error al enviar la solicitud de amistad.' });
    }
};

// Controlador para aceptar una solicitud de amistad
const acceptFriendRequest = async (req, res) => {
    try {
        console.log('Aceptando solicitud de amistad...'); // Log de inicio
        const { requestId } = req.body; // ID de la solicitud que se quiere aceptar

        // Validar que se proporcione un ID para la solicitud
        if (!requestId) {
            console.log('ID de la solicitud no proporcionado.');
            return res.status(400).json({ message: 'ID de la solicitud no proporcionado.' });
        }

        // Buscar la solicitud de amistad
        const friendRequest = await FriendRequestModel.findById(requestId);

        if (!friendRequest) {
            console.log('Solicitud de amistad no encontrada.');
            return res.status(404).json({ message: 'Solicitud de amistad no encontrada.' });
        }

        if (friendRequest.receiverId.toString() !== req.user._id.toString()) {
            console.log('No tienes permiso para aceptar esta solicitud.');
            return res.status(403).json({ message: 'No tienes permiso para aceptar esta solicitud.' });
        }

        // Actualizar el estado de la solicitud a 'ACCEPTED'
        friendRequest.status = 'ACCEPTED';
        await friendRequest.save();

        console.log('Solicitud de amistad aceptada exitosamente:', friendRequest); // Log de éxito
        res.json({ message: 'Solicitud de amistad aceptada exitosamente.', request: friendRequest });
    } catch (error) {
        console.error('Error al aceptar la solicitud de amistad:', error);
        res.status(500).json({ message: 'Error al aceptar la solicitud de amistad.' });
    }
};

// Controlador para rechazar una solicitud de amistad
const rejectFriendRequest = async (req, res) => {
    try {
        console.log('Rechazando solicitud de amistad...'); // Log de inicio
        const { requestId } = req.body; // ID de la solicitud que se quiere rechazar

        // Validar que se proporcione un ID para la solicitud
        if (!requestId) {
            console.log('ID de la solicitud no proporcionado.');
            return res.status(400).json({ message: 'ID de la solicitud no proporcionado.' });
        }

        // Buscar la solicitud de amistad
        const friendRequest = await FriendRequestModel.findById(requestId);

        if (!friendRequest) {
            console.log('Solicitud de amistad no encontrada.');
            return res.status(404).json({ message: 'Solicitud de amistad no encontrada.' });
        }

        if (friendRequest.receiverId.toString() !== req.user._id.toString()) {
            console.log('No tienes permiso para rechazar esta solicitud.');
            return res.status(403).json({ message: 'No tienes permiso para rechazar esta solicitud.' });
        }

        // Actualizar el estado de la solicitud a 'REJECTED'
        friendRequest.status = 'REJECTED';
        await friendRequest.save();

        console.log('Solicitud de amistad rechazada exitosamente:', friendRequest); // Log de éxito
        res.json({ message: 'Solicitud de amistad rechazada exitosamente.', request: friendRequest });
    } catch (error) {
        console.error('Error al rechazar la solicitud de amistad:', error);
        res.status(500).json({ message: 'Error al rechazar la solicitud de amistad.' });
    }
};

// Controlador para obtener todas las solicitudes de amistad pendientes para un usuario
const getPendingRequests = async (req, res) => {
    try {
        console.log('Obteniendo solicitudes de amistad pendientes...'); // Log de inicio
        const pendingRequests = await FriendRequestModel.find({
            receiverId: req.user._id,
            status: 'PENDING',
        }).populate('senderId', 'nombreUsuario');

        console.log('Solicitudes de amistad pendientes obtenidas:', pendingRequests); // Log de la lista de solicitudes pendientes
        res.json(pendingRequests);
    } catch (error) {
        console.error('Error al obtener las solicitudes de amistad pendientes:', error);
        res.status(500).json({ message: 'Error al obtener las solicitudes de amistad pendientes.' });
    }
};

// Exportar las funciones del controlador
module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getPendingRequests,
};
