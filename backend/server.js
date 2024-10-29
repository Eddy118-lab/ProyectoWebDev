require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Asegúrate de tener este archivo
const registerRoute = require('./routes/registerRoute'); // Ajusta la ruta según tu estructura
const loginRoute = require('./routes/loginRoute');
const userRoute = require('./routes/userRoutes');


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});