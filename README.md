# Alquiler de Equipos Médicos - Avance 2 (Semana 8)

Backend en Node.js + Express + PostgreSQL + Prisma para el proyecto ABP "Alquiler de equipos médicos".

Objetivo (Semana 8)
- Autenticación con JWT.
- Autorización por roles.
- Registro e inicio de sesión.
- Rutas protegidas y roles CLIENTE / ADMIN.
- Mantener la arquitectura por capas con routes / controllers / services.

Estructura principal
- src/: código fuente
- prisma/schema.prisma: modelos y enumeraciones
- docker-compose.yml: PostgreSQL local
- .env.example: variables de entorno
- docs/postman/: colección Postman

Requisitos mínimos
- Node.js LTS
- Docker Desktop
- Git y cuenta de GitHub

Instalación y ejecución
1. Clona el repositorio y entra a la carpeta.
2. Configura `.env` desde `.env.example`.
3. Levanta la base de datos:
   docker compose up -d
4. Instala dependencias:
   npm install
5. Genera cliente Prisma y ejecuta migración:
   npx prisma generate
   npx prisma migrate dev --name week8_auth
6. Ejecuta la API:
   npm run dev

Rutas principales
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protegida)
- GET /api/equipos
- POST /api/equipos (solo ADMIN)
- GET /api/usuarios (solo ADMIN)
- GET /api/alquileres (protegida)
- POST /api/alquileres (protegida)

Roles
- CLIENTE: puede ver su perfil y sus alquileres.
- ADMIN: puede gestionar equipos y consultar usuarios.

Notas
- La autenticación y autorización están implementadas según la guía del curso para la Semana 8.
- No se incluye Docker, servicios externos o Socket.IO todavía.
