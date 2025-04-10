const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET ||  "supersecreto";

const registrar = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existe = await prisma.user.findUnique({ where: { email } });
        if (existe) return res.status(400).json({ error: "El usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await prisma.user.findUnique({ where: { email } });
        if (!usuario) return res.status(400).json({ error: "Credenciales inválidas" });

        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) return res.status(400).json({ error: "Credenciales inválidas" });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, role: usuario.role },
            SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ mensaje: "Login exitoso", token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
}

module.exports = {
    registrar,
    login,
};