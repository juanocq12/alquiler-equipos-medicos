# Alquiler de Equipos Médicos - Avance 1 (Semana 7)

API backend realizada en Node.js + Express + PostgreSQL + Prisma para el proyecto ABP "Alquiler de equipos médicos".

Objetivo (Hito 2 · Semana 7)
- API CRUD funcional con PostgreSQL + Prisma.
- Arquitectura por capas: routes / controllers / services.
- Colección Postman con peticiones de prueba.
- Operación transaccional: crear alquiler que descuenta stock atómicamente.

Estructura principal
- src/: código fuente (app.js, server.js, routes, controllers, services, middlewares)
- prisma/schema.prisma: modelo de datos
- docker-compose.yml: configuración para PostgreSQL local (puerto 5433)
- .env.example: variables de entorno
- docs/postman/: colección Postman exportada

Requisitos mínimos
- Node.js LTS
- Docker Desktop (para PostgreSQL)
- Git y cuenta en GitHub

Instalación y ejecución (resumen)
1. Clona el repositorio y entra en la carpeta:
   git clone git@github.com:juanocq12/alquiler-equipos-medicos.git
   cd alquiler-equipos-medicos
2. Copia el archivo de ejemplo de entorno:
   cp .env.example .env
   Ajusta `DATABASE_URL` si cambias credenciales o puertos.
3. Levanta la base de datos:
   docker compose up -d
4. Instala dependencias:
   npm install
5. Genera el cliente de Prisma y aplica la migración inicial:
   npx prisma generate
   npx prisma migrate dev --name init
6. Ejecuta en modo desarrollo:
   npm run dev

Checklist de entrega (Semana 7)
- [ ] Repo en GitHub con README y carpeta `docs/`
- [ ] API CRUD para Equipos y Usuarios
- [ ] Prisma schema y migración aplicada en PostgreSQL
- [ ] Endpoint transaccional: crear alquiler (descontar stock) con prisma.$transaction
- [ ] Colección Postman en `docs/postman/`

Demostración mínima sugerida
1. Crear usuario: POST /api/usuarios
2. Crear equipo: POST /api/equipos
3. Crear alquiler: POST /api/alquileres y verificar que el stock del equipo se decrementa
4. Mostrar la migración SQL en `prisma/migrations/` y explicar el uso de `prisma.$transaction`

Notas
- No se incluyen credenciales en el repositorio. No subas el archivo `.env`.
- Esta entrega corresponde al Hito 2; la autenticación JWT y demás funcionalidades de semanas posteriores no están incluidas aquí.
