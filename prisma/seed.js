import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/utils/prisma.js';

const usuarios = [
  {
    nombre: 'Administración de desarrollo',
    email: 'admin@alquiler.local',
    password: 'Admin123!',
    rol: 'ADMIN'
  },
  {
    nombre: 'Cliente de desarrollo',
    email: 'cliente@alquiler.local',
    password: 'Cliente123!',
    rol: 'CLIENTE'
  }
];

const equipos = [
  { nombre: 'Concentrador de oxígeno', descripcion: 'Concentrador de oxígeno domiciliario', precioDia: 45000, stock: 5 },
  { nombre: 'Silla de ruedas', descripcion: 'Silla de ruedas plegable', precioDia: 18000, stock: 8 },
  { nombre: 'Cama hospitalaria', descripcion: 'Cama hospitalaria manual', precioDia: 55000, stock: 3 },
  { nombre: 'Nebulizador', descripcion: 'Nebulizador portátil', precioDia: 12000, stock: 10 },
  { nombre: 'Monitor de signos vitales', descripcion: 'Monitor básico de signos vitales', precioDia: 65000, stock: 4 }
];

try {
  for (const usuario of usuarios) {
    const passwordHash = await bcrypt.hash(usuario.password, 10);
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: {
        nombre: usuario.nombre,
        email: usuario.email,
        passwordHash,
        rol: usuario.rol
      }
    });
  }

  for (const equipo of equipos) {
    await prisma.equipo.upsert({
      where: { nombre: equipo.nombre },
      update: {
        descripcion: equipo.descripcion,
        precioDia: equipo.precioDia
      },
      create: equipo
    });
  }

  console.log('Seed listo: 2 usuarios y 5 equipos de desarrollo.');
} finally {
  await prisma.$disconnect();
}
