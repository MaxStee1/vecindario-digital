const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.user.findMany();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

const crearUsuario = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const nuevoUsuario = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role,
            },
        });
        res.status(201).json({ message: "Usuario creado con éxito" });
        
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
};