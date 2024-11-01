const FriendModel = require('../models/friendModel');

// Enviar una solicitud de amistad
exports.sendFriendRequest = async (req, res) => {
    const userId = req.user._id; // ID del usuario autenticado
    const { targetUserId } = req.body; // ID del usuario al que se enviará la solicitud

    try {
        console.log('Enviando solicitud de amistad desde', userId, 'a', targetUserId);

        // Verificar que no exista una solicitud previa
        const existingRequest = await FriendModel.findOne({
            $or: [
                { user1Id: userId, user2Id: targetUserId },
                { user1Id: targetUserId, user2Id: userId }
            ]
        });
        console.log('Solicitud previa encontrada:', existingRequest);

        if (existingRequest) {
            console.log('Solicitud ya existe o ya son amigos');
            return res.status(400).json({ message: 'Ya existe una solicitud de amistad o son amigos' });
        }

        // Crear la solicitud de amistad
        const friendRequest = new FriendModel({
            user1Id: userId,
            user2Id: targetUserId,
            status: 'pending'
        });

        await friendRequest.save();
        console.log('Solicitud de amistad guardada correctamente:', friendRequest);
        res.status(201).json({ message: 'Solicitud de amistad enviada' });
    } catch (error) {
        console.error('Error al enviar solicitud de amistad:', error);
        res.status(500).json({ message: 'Error al enviar solicitud de amistad', error });
    }
};

// Aceptar o rechazar una solicitud de amistad
exports.respondToFriendRequest = async (req, res) => {
    const userId = req.user._id.toString(); // ID del usuario autenticado
    const { requestId, action } = req.body; // `requestId` es la solicitud, `action` puede ser 'accepted' o 'rejected'

    try {
        console.log('Usuario receptor ID: ', userId)
        console.log('Respondiendo a solicitud de amistad con ID:', requestId, 'con acción:', action);

        // Buscar la solicitud de amistad usando `requestId`
        const friendRequest = await FriendModel.findById(requestId);
        
        // Verificar que la solicitud existe
        if (!friendRequest) {
            console.log('Solicitud no encontrada o no válida');
            return res.status(404).json({ message: 'Solicitud de amistad no encontrada o no válida' });
        }

        console.log('ID encontrado:', friendRequest.user2Id.toString());
        // Verificar que el usuario autenticado es el destinatario de la solicitud
        if (friendRequest.user2Id.toString() !== userId) {
            console.log('Usuario no autorizado: solo el destinatario puede responder a la solicitud');
            return res.status(403).json({ message: 'No autorizado para responder a esta solicitud' });
        }
      

        // Actualizar el estado de la solicitud (aceptada o rechazada)
        friendRequest.status = action;
        await friendRequest.save();
        console.log(`Solicitud de amistad actualizada a ${action}`, friendRequest);

        res.status(200).json({ message: `Solicitud de amistad ${action}` });
    } catch (error) {
        console.error('Error al responder a la solicitud de amistad:', error);
        res.status(500).json({ message: 'Error al responder a la solicitud de amistad', error });
    }
};

// Ver solicitudes de amistad enviadas y recibidas
exports.getFriendRequests = async (req, res) => {
    const userId = req.user._id;

    try {
        console.log('Obteniendo solicitudes de amistad para el usuario:', userId);

        // Solicitudes enviadas
        const sentRequests = await FriendModel.find({ user1Id: userId, status: 'pending' })
            .populate('user2Id', 'nombreUsuario fotoPerfil');
        console.log('Solicitudes enviadas:', sentRequests);

        // Solicitudes recibidas
        const receivedRequests = await FriendModel.find({ user2Id: userId, status: 'pending' })
            .populate('user1Id', 'nombreUsuario fotoPerfil');
        console.log('Solicitudes recibidas:', receivedRequests);

        res.status(200).json({ sentRequests, receivedRequests });
    } catch (error) {
        console.error('Error al obtener solicitudes de amistad:', error);
        res.status(500).json({ message: 'Error al obtener solicitudes de amistad', error });
    }
};
