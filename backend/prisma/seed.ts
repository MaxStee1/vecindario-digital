import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roles = ['administrador', 'locatario', 'comprador'] as const;
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const hashedPassword = await bcrypt.hash('password', 10);

  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Uno',
      email: 'admin@admin.com',
      password: hashedPassword,
      userRoles: {
        create: {
          role: {
            connect: { name: 'administrador'},
          },
        },
      },
    },
  });

  const locatarioUser = await prisma.user.create({
    data: {
      firstName: 'Locaatario',
      lastName: 'Mercado',
      email: 'locatario@example.com',
      password: hashedPassword,
      userRoles: {
        create: {
          role: {
            connect: { name: 'locatario' },
          },
        },
      },
      locatario: {
        create: {
          storeName: 'Tienda uno',
          address: 'calle 123',
          phone: '123456789',
          products: {
            create: [
              {
                name: 'Pan amasado',
                price: 1000,
                description: 'Pan fresco recien horneado',
              },
            ],
          },
        },
      },
    },
  });

  console.log('datos de prueba insertados con exito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })