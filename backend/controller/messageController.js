const MessageModel = require('../models/messageModel');
const UserModel = require('../models/userModel');


exports.sendMessage = async (req, res) => {
    const { content, senderId, receiverId } = req.body;

    // Validación: asegurarse de que el contenido no esté vacío
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'El contenido del mensaje no puede estar vacío.' });
    }

    try {
        // Validar que el receptor sea amigo del emisor
        const sender = await UserModel.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: 'Usuario emisor no encontrado.' });
        }

        if (!sender.friends.includes(receiverId)) {
            return res.status(403).json({ message: 'No puedes enviar mensajes a este usuario.' });
        }

        // Crear el nuevo mensaje
        const newMessage = new MessageModel({ content, senderId, receiverId });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ message: 'Error al enviar el mensaje', error });
    }
};

// Obtener mensajes de la bandeja de entrada
exports.getInbox = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await MessageModel.find({ receiverId: userId }).populate('senderId', 'username'); // Cambia 'username' según el campo que desees mostrar
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes', error });
    }
};

// Obtener mensajes enviados
exports.getSentMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await MessageModel.find({ senderId: userId }).populate('receiverId', 'username'); // Cambia 'username' según el campo que desees mostrar
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes enviados', error });
    }
};

// Marcar un mensaje como leído
exports.markAsRead = async (req, res) => {
    const { messageId } = req.params;
    try {
        const updatedMessage = await MessageModel.findByIdAndUpdate(messageId, { isRead: true }, { new: true });
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar el mensaje como leído', error });
    }
};


// Obtener posts de un usuario específico (para perfil)
exports.getUsermessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await messageModel.find({ user_id: userId }).populate('user_id', 'nombreUsuario fotoPerfil');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener los posts del usuario:', error);
        res.status(500).json({ error: 'Error al obtener los posts del usuario' });
    }
};


