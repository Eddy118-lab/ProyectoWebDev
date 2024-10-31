// Importa multer y CloudinaryStorage
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // Importa tu configuración de Cloudinary

// Configura el almacenamiento en Cloudinary para las imágenes de posts
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts', // Carpeta específica en Cloudinary para los posts
    allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
  },
});

// Middleware para subir archivos con multer usando el almacenamiento en Cloudinary
const uploadsPost = multer({ storage: storage });

module.exports = uploadsPost;
