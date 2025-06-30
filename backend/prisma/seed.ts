import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Enviando datos a la DB...');

  // crear usuarios base
  const password = await bcrypt.hash('password', 10);

  await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      email: 'ad@admin.com',
      contrasenia: password,
      rol: 'admin',
      telefono: '+56912345678',
    },
  });

  // Crear varios locatarios
  const locatario1 = await prisma.usuario.create({
    data: {
      nombre: 'Locatario1',
      email: 'locatario@gmail.com',
      contrasenia: password,
      rol: 'locatario',
      telefono: '+56987654321',
      direccion: 'Calle principal 1, Coquimbo',
      locatario: {
        create: {
          nombreTienda: 'Primer Almacen',
          descripcion: 'productos de caracter tecnologico',
          direccionTienda: 'calle Principal 1, Local 5',
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
      nombre: 'María González',
      email: 'maria@gmail.com',
      contrasenia: password,
      rol: 'locatario',
      telefono: '+56955555555',
      direccion: 'Avenida Secundaria 456, Santiago',
      locatario: {
        create: {
          nombreTienda: 'Verdulería Fresca',
          descripcion: 'Frutas y verduras frescas de la huerta',
          direccionTienda: 'Avenida Secundaria 456, Local 2',
          horarioApertura: '07:30',
          horarioCierre: '19:30',
          metodosEntrega: ['retiro', 'envio'],
        },
      },
    },
    include: { locatario: true },
  });

  // crear compradores

  const comprador1 = await prisma.usuario.create({
    data: {
      nombre: 'Max',
      email: 'max@gmail.com',
      contrasenia: password,
      rol: 'comprador',
      telefono: '+56911111111',
      direccion: 'calle residencial 786, numero 2',
      comprador: {
        create: {
          direccionEntrega: 'calle residencial 786, numero 2',
        },
      },
    },
    include: { comprador: true },
  });

  const comprador2 = await prisma.usuario.create({
    data: {
      nombre: 'Ana Martínez',
      email: 'ana@cliente.com',
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

  // Crear productos para los locatarios
  await prisma.producto.createMany({
    data: [
      {
        nombre: 'Memoria RAM 8 GB',
        descripcion: 'Memoria RAM 8GB 1rx8 3200MHz',
        precio: 30000,
        stock: 10,
        locatarioId: locatario1.locatario?.id!,
      },
      {
        nombre: 'Teclado mecanico',
        precio: 45000,
        stock: 10,
        locatarioId: locatario1.locatario?.id!,
      },
      {
        nombre: 'Cargador tipo C',
        precio: 10000,
        stock: 25,
        locatarioId: locatario1.locatario?.id!,
      },
      {
        nombre: 'Manzanas',
        descripcion: 'Manzanas rojas del sur',
        precio: 990,
        stock: 40,
        locatarioId: locatario2.locatario?.id!,
      },
      {
        nombre: 'Lechuga',
        descripcion: 'Lechuga fresca',
        precio: 590,
        stock: 25,
        locatarioId: locatario2.locatario?.id!,
      },
      {
        nombre: 'Tomates',
        descripcion: 'Tomates perita',
        precio: 790,
        stock: 35,
        locatarioId: locatario2.locatario?.id!,
      },
    ],
  });

  // Obtener productos para el carrito (usando findMany para obtener los IDs)
  const productos = await prisma.producto.findMany();

  // Agregar productos al carrito de comprador1
  await prisma.carritoItem.createMany({
    data: [
      {
        compradorId: comprador1.comprador?.id!,
        productoId: productos[0].id, // Memoria RAM 8 GB
        cantidad: 2,
      },
      {
        compradorId: comprador1.comprador?.id!,
        productoId: productos[3].id, // Manzanas
        cantidad: 5,
      },
    ],
  });

  // Agregar productos al carrito de comprador2
  await prisma.carritoItem.createMany({
    data: [
      {
        compradorId: comprador2.comprador?.id!,
        productoId: productos[1].id,
        cantidad: 1,
      },
      {
        compradorId: comprador2.comprador?.id!,
        productoId: productos[5].id,
        cantidad: 10,
      },
    ],
  });

  // crear pedidos (sin metodoEntrega)
  const pedido1 = await prisma.pedido.create({
    data: {
      compradorId: comprador1.comprador?.id!,
      estado: 'entregado',
      direccionEntrega: comprador1.comprador?.direccionEntrega,
      fechaPedido: new Date(Date.now() - 86400000 * 2), // 2 dias atras
      fechaEntrega: new Date(Date.now() - 86400000 * 1),  // 1 dia atras
      total: 40000,
      notas: 'dejar en porteria',
    }
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      compradorId: comprador2.comprador?.id!,
      estado: 'pendiente',
      direccionEntrega: comprador2.comprador?.direccionEntrega,
      fechaPedido: new Date(),
      fechaEntrega: new Date(Date.now()),
      total: 23600,
    }
  });

  // Si tu modelo de Valoracion no tiene tipoEntrega, no lo agregues aquí.
  // Ejemplo de valoración (ajusta si tu modelo lo requiere)
  // await prisma.valoracion.create({
  //   data: {
  //     compradorId: comprador1.comprador?.id!,
  //     productoId: productos[0].id,
  //     calificacion: 5,
  //     comentario: "Excelente producto",
  //     fecha: new Date(),
  //   }
  // });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });