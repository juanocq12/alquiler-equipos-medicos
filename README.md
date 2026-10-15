# Alquiler de Equipos Médicos - Avance 1 (Semana 7)

Backend en Node.js + Express + PostgreSQL + Prisma para el proyecto ABP "Alquiler de equipos médicos".

Objetivo (Sem.7 / Hito 2)
- API CRUD funcional con PostgreSQL + Prisma.
- Arquitectura por capas: routes / controllers / services.
- Postman collection con peticiones de prueba.
- Transacción principal: crear alquiler que descuenta stock atómicamente.

Estructura principal
- src/: código fuente (app.js, server.js, routes, controllers, services, middlewares)
- prisma/schema.prisma: modelo de datos
- docker-compose.yml: PostgreSQL local (puerto 5433)
- .env.example: variables de entorno
- docs/postman/: colección Postman exportada

Requisitos locales
- Node.js LTS (usa nvm)
- Docker Desktop (levanta PostgreSQL)
- Git y cuenta de GitHub

Instalación rápida (local)
1. Clona el repo y entra en la carpeta:
   git clone git@github.com:juanocq12/alquiler-equipos-medicos.git
   cd alquiler-equipos-medicos
2. Crea `.env` a partir de `.env.example` y ajusta `DATABASE_URL` si es necesario.
3. Levanta la BD local:
   docker compose up -d
4. Instala dependencias:
   npm install
5. Genera cliente Prisma y migra:
   npx prisma generate
   npx prisma migrate dev --name init
6. Ejecuta en modo desarrollo:
   npm run dev

Checklist de entrega Sem.7 (Hito 2)
- [ ] Repo en GitHub con README y docs/
- [ ] API CRUD para Equipos y Usuarios
- [ ] Prisma schema + migración aplicada en PostgreSQL
- [ ] Endpoint transaccional: crear alquiler (descontar stock) con $transaction
- [ ] Postman collection en docs/postman/
- [ ] Instrucciones claras en README.md

Demostración mínima para el profesor
1. Crear usuario (POST /api/usuarios)
2. Crear equipo (POST /api/equipos)
3. Crear alquiler (POST /api/alquileres) y mostrar que el stock del equipo se decrementa
4. Mostrar la migración SQL en prisma/migrations/ y explicar el uso de prisma.$transaction

Notas importantes
- No incluya archivos con credenciales reales (.env no debe subirse).
- Esta entrega corresponde al Hito 2: no incluye autenticación JWT (semana 8).
