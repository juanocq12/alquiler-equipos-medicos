-- Migration: init + week8 auth

CREATE TYPE "Role" AS ENUM ('CLIENTE', 'ADMIN');
CREATE TYPE "EstadoAlquiler" AS ENUM ('PENDIENTE', 'ACTIVO', 'FINALIZADO', 'CANCELADO');

CREATE TABLE "Usuario" (
    "id" SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'CLIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Equipo" (
    "id" SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL UNIQUE,
    "descripcion" TEXT,
    "precioDia" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Alquiler" (
    "id" SERIAL PRIMARY KEY,
    "usuarioId" INTEGER NOT NULL,
    "estado" "EstadoAlquiler" NOT NULL DEFAULT 'PENDIENTE',
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alquiler_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "AlquilerItem" (
    "id" SERIAL PRIMARY KEY,
    "alquilerId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioDia" INTEGER NOT NULL,
    CONSTRAINT "AlquilerItem_alquilerId_fkey" FOREIGN KEY ("alquilerId") REFERENCES "Alquiler"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlquilerItem_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
