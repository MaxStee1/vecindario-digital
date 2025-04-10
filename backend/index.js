const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const usuarioRoutes = require('./routes/usuario.routes');
// Usar las rutas de usuarios
app.use('/api/usuarios', usuarioRoutes);

const authRoutes = require('./routes/auth.routes');
// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Servidor funcionando!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});