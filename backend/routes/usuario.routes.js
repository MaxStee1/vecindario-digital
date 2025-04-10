const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario } = require('../controllers/usuario.controller');
const { verificarToken,verificarRol } = require('../middlewares/auth.middleware');


router.get('/', verificarToken, obtenerUsuarios);

// Solo los administradores pueden crear usuarios
router.post('/', verificarToken, verificarRol(['ADMIN']), crearUsuario);


module.exports = router;