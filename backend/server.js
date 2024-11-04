require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Asegúrate de tener este archivo
const registerRoute = require('./routes/registerRoute'); // Ajusta la ruta según tu estructura
const loginRoute = require('./routes/loginRoute');
const userRoute = require('./routes/userRoutes');
const postRoute = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoute');
const friendRoutes = require('./routes/friendsRoute');
const likeRoutes = require('./routes/likeRoute');
const commentRoutes = require('./routes/commentRoute');

const app = express();

app.use(cors());

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Usar la ruta de registro
app.use('/register', registerRoute);

app.use('/login', loginRoute);

app.use('/feed', userRoute);

app.use('/post', postRoute);

app.use('/messages', messageRoutes);

app.use('/friends', friendRoutes);

app.use('/likes', likeRoutes);

app.use('/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});