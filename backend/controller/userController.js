const UserModel = require('../models/userModel');

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

// Controlador para eliminar la cuenta del usuario
const deleteUser = async (req, res) => {
    try {
        console.log('Eliminando cuenta del usuario...'); // Log de inicio
        const deletedUser = await UserModel.findByIdAndDelete(req.user._id);

        if (!deletedUser) {
            console.log('Usuario no encontrado al eliminar.');
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        console.log('Cuenta eliminada exitosamente.'); // Log de éxito
        res.json({ message: 'Cuenta eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la cuenta del usuario:', error);
        res.status(500).json({ message: 'Error al eliminar la cuenta del usuario.' });
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

// Controlador para obtener todos los usuarios excepto el usuario logueado
const getAllUsersExceptLoggedIn = async (req, res) => {
    try {
        console.log('Obteniendo lista de todos los usuarios, excepto el usuario logueado...');

        // Obtenemos el ID del usuario logueado
        const loggedInUserId = req.user._id;

        // Buscamos todos los usuarios excepto el usuario logueado
        const users = await UserModel.find({ _id: { $ne: loggedInUserId } })
            .select('-contrasena') // Excluir campo de contraseña por seguridad
            .lean();

        console.log('Usuarios obtenidos:', users);
        res.json(users);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios.' });
    }
};

module.exports = {
    getUserInfo,
    updateUser,
    deleteUser,
    updateProfilePicture,
    getAllUsersExceptLoggedIn, // Exportar el nuevo controlador
};
