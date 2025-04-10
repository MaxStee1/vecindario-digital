const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "supersecreto";

const verificarToken = (req, res, next) => {
    const authHrader = req.headers.authorization;

    if (!authHrader || !authHrader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHrader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Token no válido" });
    }
};

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ error: "Acceso denegado" });
        }
        next();
    };
};

module.exports = {
    verificarToken,
    verificarRol,
};