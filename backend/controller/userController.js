const UserModel = require('../models/userModel');
const FriendModel = require('../models/friendModel');
const MessageModel = require('../models/messageModel');
const CommentModel = require('../models/commentModel');
const PostModel = require('../models/postModel');

// Controlador para obtener la información del usuario logueado
const getUserInfo = async (req, res) => {
    try {
        console.log('Obteniendo información del usuario logueado...'); // Log de inicio
        const { contrasena, ...userInfo } = req.user.toObject();
        console.log('Información del usuario:', userInfo); // Log de la información del usuario
        res.json(userInfo);
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).json({ message: 'Error al obtener la información del usuario.' });
    }
};

// Controlador para actualizar campos individuales de usuario
const updateUser = async (req, res) => {
    try {
        console.log('Actualizando información del usuario...'); // Log de inicio
        const { nombreUsuario, numeroTelefono, biografia, genero } = req.body;

        // Validar si al menos un campo fue proporcionado
        if (!nombreUsuario && !numeroTelefono && !biografia && !genero) {
            console.log('No se proporcionó ningún campo para actualizar.');
            return res.status(400).json({ message: 'No se proporcionó ningún campo para actualizar.' });
        }

        // Construir un objeto de actualización solo con los campos proporcionados
        const updateData = {};
        if (nombreUsuario) updateData.nombreUsuario = nombreUsuario;
        if (numeroTelefono) updateData.numeroTelefono = numeroTelefono;
        if (biografia) updateData.biografia = biografia;
        if (genero) updateData.genero = genero;

        console.log('Datos de actualización:', updateData); // Log de los datos de actualización

        // Actualizar el usuario solo con los campos presentes en `updateData`
        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, updateData, { new: true });

        if (!updatedUser) {
            console.log('Usuario no encontrado al actualizar.');
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        console.log('Información actualizada exitosamente:', updatedUser); // Log de éxito
        res.json({ message: 'Información actualizada exitosamente.', user: updatedUser });
    } catch (error) {
        console.error('Error al actualizar la información del usuario:', error);
        res.status(500).json({ message: 'Error al actualizar la información del usuario.' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // Obtener el ID del usuario a eliminar

        // 1. Eliminar publicaciones del usuario
        await PostModel.deleteMany({ user_id: userId });

        // 2. Eliminar comentarios del usuario
        await CommentModel.deleteMany({ user_id: userId });

        // 3. Eliminar mensajes del usuario
        await MessageModel.deleteMany({ sender_id: userId }); // Suponiendo que el usuario puede ser un remitente

        // 4. (Opcional) Eliminar amigos o relaciones si es necesario
        await FriendModel.deleteMany({ $or: [{ user1Id: userId }, { user2Id: userId }] });

        // 5. Finalmente, eliminar el usuario
        await UserModel.findByIdAndDelete(userId);

        res.json({ message: 'Usuario y sus documentos relacionados eliminados correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario.' });
    }
};


const updateProfilePicture = async (req, res) => {
    try {
        console.log('Actualizando foto de perfil...'); // Log de inicio
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen.' });
        }

        console.log('Archivo recibido:', req.file); // Agrega este log
        const imageUrl = req.file.path; // URL de la imagen cargada

        console.log('ID del usuario a actualizar:', req.user._id);
        // Actualizar el campo de fotoPerfil en el usuario
        const updatedUser2 = await UserModel.findByIdAndUpdate(req.user._id, { fotoPerfil: imageUrl }, { new: true });

        if (!updatedUser2) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        console.log('Foto de perfil actualizada exitosamente:', updatedUser2.fotoPerfil); // Log de éxito
        res.json({ message: 'Foto de perfil actualizada exitosamente.', user: updatedUser2 });
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        res.status(500).json({ message: 'Error al actualizar la foto de perfil.' });
    }
};

// Controlador para obtener todos los usuarios excepto el usuario logueado y los amigos actuales
const getAllUsersExceptLoggedIn = async (req, res) => {
    try {
        console.log('Obteniendo lista de todos los usuarios, excepto el usuario logueado y sus amigos...');

        // Obtenemos el ID del usuario logueado
        const loggedInUserId = req.user._id;

        // Obtener IDs de amigos con los que tiene relación "accepted"
        const friends = await FriendModel.find({
            $or: [
                { user1Id: loggedInUserId, status: 'accepted' },
                { user2Id: loggedInUserId, status: 'accepted' }
            ]
        }).lean();

        // Extraer IDs de amigos del resultado
        const friendIds = friends.map(friend =>
            friend.user1Id.toString() === loggedInUserId.toString() ? friend.user2Id : friend.user1Id
        );

        // Incluir el usuario logueado en la lista de exclusión
        friendIds.push(loggedInUserId);

        // Buscar todos los usuarios excepto el logueado y sus amigos
        const users = await UserModel.find({ _id: { $nin: friendIds } })
            .select('-contrasena') // Excluir campo de contraseña por seguridad
            .lean();

        console.log('Usuarios obtenidos:', users);
        res.json(users);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios.' });
    }
};

// Controlador para obtener solo los perfiles que son amigos del usuario logueado
const getFriendsProfiles = async (req, res) => {
    try {
        console.log('Obteniendo lista de perfiles amigos del usuario logueado...');

        // Obtenemos el ID del usuario logueado
        const loggedInUserId = req.user._id;

        // Obtener IDs de los amigos con los que tiene una relación "accepted"
        const friends = await FriendModel.find({
            $or: [
                { user1Id: loggedInUserId, status: 'accepted' },
                { user2Id: loggedInUserId, status: 'accepted' }
            ]
        }).lean();

        // Extraer IDs de los amigos del resultado
        const friendIds = friends.map(friend =>
            friend.user1Id.toString() === loggedInUserId.toString() ? friend.user2Id : friend.user1Id
        );

        // Buscar los perfiles de amigos usando sus IDs
        const friendProfiles = await UserModel.find({ _id: { $in: friendIds } })
            .select('-contrasena') // Excluir campo de contraseña por seguridad
            .lean();

        console.log('Perfiles de amigos obtenidos:', friendProfiles);
        res.json(friendProfiles);
    } catch (error) {
        console.error('Error al obtener la lista de perfiles de amigos:', error);
        res.status(500).json({ message: 'Error al obtener la lista de perfiles de amigos.' });
    }
};

module.exports = {
    getUserInfo,
    updateUser,
    deleteUser,
    updateProfilePicture,
    getAllUsersExceptLoggedIn,
    getFriendsProfiles, 
};
