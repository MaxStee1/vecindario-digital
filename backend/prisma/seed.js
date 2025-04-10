const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    // Crear algunos usuarios de ejemplo
    const hashedPassword = await bcrypt.hash('password',10);
     await prisma.user.createMany({
        data: [
            {
                name: 'Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
            {
                name: 'User',
                email: 'locatario@example.com',
                password: hashedPassword,
                role: 'LOCATARIO',
            },
            {
                name: 'Comprador',
                email: 'comprador@example.com',
                password: hashedPassword,
                role: 'COMPRADOR',
            },
        ],
     });
     console.log('Usuarios creados');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });