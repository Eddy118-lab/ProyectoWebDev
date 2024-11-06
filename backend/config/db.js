const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

// Función para conectar a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        console.log('Conexión a la base de datos MongoDB Atlas establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit(1); // Terminar el proceso en caso de error
    }
};

// Exportar la función de conexión
module.exports = connectDB;
