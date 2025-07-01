import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Enviando datos a la DB...');

  // Password hash
  const password = await bcrypt.hash('password', 10);

  // Crear usuarios base
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      email: 'admin@gmail.com',
      contrasenia: password,
      rol: 'admin',
      telefono: '+56912345678',
    },
  });

  // Locatarios
  const locatario1 = await prisma.usuario.create({
    data: {
      nombre: 'Bruno Fernandez',
      email: 'loc1@gmail.com',
      contrasenia: password,
      rol: 'locatario',
      telefono: '+56987654321',
      direccion: 'Calle Principal 1, Coqumbo',
      locatario: {
        create: {
          nombreTienda: 'Almacen Future',
          descripcion: 'Tecnología y accesorios',
          direccionTienda: 'Calle Principal 1, Local 5',
          horarioApertura: '08:00',
          horarioCierre: '20:00',
          metodosEntrega: ['envio', 'retiro'],
        },
      },
    },
    include: { locatario: true }
  });

  const locatario2 = await prisma.usuario.create({
    data: {
      nombre: 'Roberto Carlos',
      email: 'loc2@gmail.com',
      contrasenia: password,
      rol: 'locatario',
      telefono: '+56955555555',
      direccion: 'Avenida Secundaria 456, Ciudad',
      locatario: {
        create: {
          nombreTienda: 'Verdulería Dia a Dia',
          descripcion: 'Frutas y verduras frescas',
          direccionTienda: 'Avenida Secundaria 456, Local 2',
          horarioApertura: '07:30',
          horarioCierre: '19:30',
          metodosEntrega: ['retiro', 'envio'],
        },
      },
    },
    include: { locatario: true }
  });

  // Proveedores
  const proveedor1 = await prisma.proveedor.create({
    data: {
      nombre: 'TecnoFlies',
      email: 'proveedor1@gmail.com',
      locatarios: {
        connect: [{ id: locatario1.locatario!.id }]
      }
    }
  });

  const proveedor2 = await prisma.proveedor.create({
    data: {
      nombre: 'VeggieLife',
      email: 'proveedor2@gmail.com',
      locatarios: {
        connect: [{ id: locatario2.locatario!.id }]
      }
    }
  });

  // Categorías
  const categoria1 = await prisma.categoria.create({
    data: {
      nombre: 'Tecnología',
      locatarioId: locatario1.locatario!.id,
    }
  });

  const categoria2 = await prisma.categoria.create({
    data: {
      nombre: 'Verduras',
      locatarioId: locatario2.locatario!.id,
    }
  });

  // Compradores
  const comprador1 = await prisma.usuario.create({
    data: {
      nombre: 'Fernando Perez',
      email: 'comprador1@gmail.com',
      contrasenia: password,
      rol: 'comprador',
      telefono: '+56911111111',
      direccion: 'Calle Residencial 786, N°2',
      comprador: {
        create: {
          direccionEntrega: 'Calle Residencial 786, N°2',
        },
      },
    },
    include: { comprador: true },
  });

  const comprador2 = await prisma.usuario.create({
    data: {
      nombre: 'Alexis Torres',
      email: 'comprador2@gmail.com',
      contrasenia: password,
      rol: 'comprador',
      telefono: '+56922222222',
      direccion: 'Pasaje Privado 321, Casa 5',
      comprador: {
        create: {
          direccionEntrega: 'Pasaje Privado 321, Casa 5',
        },
      },
    },
    include: { comprador: true },
  });

  // Repartidor
  const repartidor = await prisma.usuario.create({
    data: {
      nombre: 'Jordan Silva',
      email: 'repartidor@gmail.com',
      contrasenia: password,
      rol: 'repartidor',
      telefono: '+56933333333',
      direccion: 'Calle Delivery 123',
      repartidor: {
        create: {
          disponible: true,
          ubicacionActual: 'Calle Delivery 123',
        }
      }
    },
    include: { repartidor: true }
  });

  // Productos
  const producto1 = await prisma.producto.create({
    data: {
      nombre: 'Memoria RAM 8GB',
      descripcion: 'Memoria RAM DDR4 3200MHz',
      precio: 30000,
      stock: 10,
      locatarioId: locatario1.locatario!.id,
      categorias: { connect: [{ id: categoria1.id }] }
    }
  });

  const producto2 = await prisma.producto.create({
    data: {
      nombre: 'Teclado Mecánico',
      descripcion: 'Teclado RGB',
      precio: 45000,
      stock: 5,
      locatarioId: locatario1.locatario!.id,
      categorias: { connect: [{ id: categoria1.id }] }
    }
  });

  const producto3 = await prisma.producto.create({
    data: {
      nombre: 'Lechuga',
      descripcion: 'Lechuga fresca',
      precio: 800,
      stock: 30,
      locatarioId: locatario2.locatario!.id,
      categorias: { connect: [{ id: categoria2.id }] }
    }
  });

  const producto4 = await prisma.producto.create({
    data: {
      nombre: 'Tomate',
      descripcion: 'Tomate perita',
      precio: 900,
      stock: 25,
      locatarioId: locatario2.locatario!.id,
      categorias: { connect: [{ id: categoria2.id }] }
    }
  });

  // Pedido 1 (entregado)
  const pedido1 = await prisma.pedido.create({
    data: {
      compradorId: comprador1.comprador!.id,
      repartidorId: repartidor.repartidor!.id,
      estado: 'entregado',
      direccionEntrega: comprador1.comprador!.direccionEntrega,
      fechaPedido: new Date(Date.now() - 86400000 * 2),
      fechaEntrega: new Date(Date.now() - 86400000 * 1),
      total: 70000,
      notas: 'Dejar en portería',
      productos: {
        create: [
          {
            productoId: producto1.id,
            cantidad: 2,
            precio: 60000,
          },
          {
            productoId: producto3.id,
            cantidad: 5,
            precio: 4000,
          },
        ]
      },
      ventasLocatario: {
        create: [
          {
            locatarioId: locatario1.locatario!.id,
            total: 60000,
            estado: 'entregado'
          },
          {
            locatarioId: locatario2.locatario!.id,
            total: 4000,
            estado: 'entregado'
          }
        ]
      }
    }
  });

  // Pedido 2 (pendiente)
  const pedido2 = await prisma.pedido.create({
    data: {
      compradorId: comprador2.comprador!.id,
      repartidorId: repartidor.repartidor!.id,
      estado: 'enReparto',
      direccionEntrega: comprador2.comprador!.direccionEntrega,
      fechaPedido: new Date(),
      total: 45900,
      notas: 'Llamar antes de llegar',
      productos: {
        create: [
          {
            productoId: producto2.id,
            cantidad: 1,
            precio: 45000,
          },
          {
            productoId: producto4.id,
            cantidad: 1,
            precio: 900,
          },
        ]
      },
      ventasLocatario: {
        create: [
          {
            locatarioId: locatario1.locatario!.id,
            total: 45000,
            estado: 'pendiente'
          },
          {
            locatarioId: locatario2.locatario!.id,
            total: 900,
            estado: 'pendiente'
          }
        ]
      }
    }
  });

  // Valoraciones
  await prisma.valoracion.createMany({
    data: [
      {
        compradorId: comprador1.comprador!.id,
        productoId: producto1.id,
        calificacion: 5,
        comentario: 'Excelente producto',
        fecha: new Date(),
      },
      {
        compradorId: comprador2.comprador!.id,
        productoId: producto4.id,
        calificacion: 4,
        comentario: 'Muy buenos tomates',
        fecha: new Date(),
      }
    ]
  });

  console.log('Seed completo!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });