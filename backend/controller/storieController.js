const StorieModel = require('../models/storieModel');

// Controlador para crear una nueva historia
const createStorie = async (req, res) => {
    try {
        console.log('Creando una nueva historia...'); // Log de inicio
        const { content, imageUrl, expiredAt } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!content || !expiredAt || !req.user._id) {
            console.log('Faltan campos requeridos para crear la historia.');
            return res.status(400).json({ message: 'Faltan campos requeridos.' });
        }

        const newStorie = new StorieModel({
            content,
            imageUrl,
            expiredAt,
            userId: req.user._id // ID del usuario logueado
        });

        const savedStorie = await newStorie.save();
        console.log('Historia creada exitosamente:', savedStorie); // Log de éxito
        res.status(201).json({ message: 'Historia creada exitosamente.', storie: savedStorie });
    } catch (error) {
        console.error('Error al crear la historia:', error);
        res.status(500).json({ message: 'Error al crear la historia.' });
    }
};

// Controlador para obtener todas las historias de un usuario
const getStoriesByUser = async (req, res) => {
    try {
        console.log('Obteniendo historias del usuario...'); // Log de inicio
        const stories = await StorieModel.find({ userId: req.user._id });

        console.log('Historias obtenidas:', stories); // Log de las historias obtenidas
        res.json(stories);
    } catch (error) {
        console.error('Error al obtener historias del usuario:', error);
        res.status(500).json({ message: 'Error al obtener historias del usuario.' });
    }
};

// Controlador para actualizar una historia
const updateStorie = async (req, res) => {
    try {
        console.log('Actualizando la historia...'); // Log de inicio
        const { storieId } = req.params; // ID de la historia a actualizar
        const { content, imageUrl, expiredAt } = req.body;

        // Validar si al menos un campo fue proporcionado
        if (!content && !imageUrl && !expiredAt) {
            console.log('No se proporcionó ningún campo para actualizar.');
            return res.status(400).json({ message: 'No se proporcionó ningún campo para actualizar.' });
        }

        const updateData = {};
        if (content) updateData.content = content;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (expiredAt) updateData.expiredAt = expiredAt;

        console.log('Datos de actualización:', updateData); // Log de los datos de actualización

        // Actualizar la historia
        const updatedStorie = await StorieModel.findByIdAndUpdate(storieId, updateData, { new: true });

        if (!updatedStorie) {
            console.log('Historia no encontrada al actualizar.');
            return res.status(404).json({ message: 'Historia no encontrada.' });
        }

        console.log('Historia actualizada exitosamente:', updatedStorie); // Log de éxito
        res.json({ message: 'Historia actualizada exitosamente.', storie: updatedStorie });
    } catch (error) {
        console.error('Error al actualizar la historia:', error);
        res.status(500).json({ message: 'Error al actualizar la historia.' });
    }
};

// Controlador para eliminar una historia
const deleteStorie = async (req, res) => {
    try {
        console.log('Eliminando la historia...'); // Log de inicio
        const { storieId } = req.params; // ID de la historia a eliminar
        const deletedStorie = await StorieModel.findByIdAndDelete(storieId);

        if (!deletedStorie) {
            console.log('Historia no encontrada al eliminar.');
            return res.status(404).json({ message: 'Historia no encontrada.' });
        }

        console.log('Historia eliminada exitosamente.'); // Log de éxito
        res.json({ message: 'Historia eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la historia:', error);
        res.status(500).json({ message: 'Error al eliminar la historia.' });
    }
};

// Exportar las funciones del controlador
module.exports = {
    createStorie,
    getStoriesByUser,
    updateStorie,
    deleteStorie,
};
