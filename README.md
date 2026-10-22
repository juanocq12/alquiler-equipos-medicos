# Alquiler de equipos médicos — Semana 8

API REST en JavaScript con Node.js, Express, PostgreSQL y Prisma. Incluye registro e inicio de sesión con JWT, roles `CLIENTE` y `ADMIN`, gestión de equipos y creación transaccional de alquileres con descuento de stock.

## Requisitos

- Node.js 20 o superior
- Docker Desktop
- npm

## Instalación y arranque

1. Clona el repositorio y abre una terminal en su carpeta.
2. Copia `.env.example` como `.env`. Ajusta `DATABASE_URL` y `JWT_SECRET` si es necesario; no compartas ni subas `.env`.
3. Instala dependencias y levanta PostgreSQL:

   ```bash
   npm install
   docker compose up -d
   ```

4. Aplica las migraciones y genera el cliente Prisma:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Inicia la API:

   ```bash
   npm run dev
   ```

La API queda disponible en `http://localhost:3000` (o en el puerto definido en `.env`). Para una base ya migrada, `npm run prisma:deploy` aplica las migraciones pendientes sin crear nuevas.

La configuración de ejemplo usa PostgreSQL en `localhost:5434`, base `alquiler`, usuario `campuseats` y contraseña local `secreto123`; coincide con `docker-compose.yml` y evita interferir con otros PostgreSQL locales que usen el puerto `5433`. Si ya existe el volumen `db_data`, conserva sus datos al levantar o bajar el contenedor. No uses `docker compose down -v` salvo que quieras borrar la base local.

## Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Público; crea un usuario `CLIENTE` |
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/auth/me` | Autenticado |
| `GET` | `/api/equipos` | Autenticado |
| `GET` | `/api/equipos/:id` | Público |
| `POST`, `PUT`, `DELETE` | `/api/equipos` y `/api/equipos/:id` | Solo `ADMIN` |
| `GET` | `/api/usuarios` y `/api/usuarios/:id` | Solo `ADMIN` |
| `POST` | `/api/usuarios` | Solo `ADMIN` |
| `GET` | `/api/alquileres` y `/api/alquileres/:id` | Autenticado; `CLIENTE` solo ve sus alquileres |
| `POST` | `/api/alquileres` | Autenticado |

Las respuestas de usuarios y alquileres nunca incluyen `passwordHash`. Al crear un alquiler, el usuario se toma del token, se validan fechas, equipos y stock, y se guarda el alquiler, sus items y el descuento de inventario dentro de una transacción. Si el stock no alcanza, responde `409` y la transacción revierte todos los cambios.

## Roles

- `CLIENTE`: puede consultar equipos autenticado, crear alquileres y consultar únicamente sus propios alquileres.
- `ADMIN`: además puede crear, actualizar y eliminar equipos y consultar/crear usuarios.

El registro público siempre crea `CLIENTE`; no acepta que el cliente se asigne el rol `ADMIN`. Para preparar el administrador inicial en desarrollo, registra una cuenta y cambia su campo `rol` a `ADMIN` desde Prisma Studio:

```bash
npx prisma studio
```

En producción, provisiona el primer administrador mediante un proceso administrativo seguro. No dejes habilitada una ruta pública que permita asignar roles privilegiados.

## Probar con Postman

Importa [`docs/postman/alquileres.postman_collection.json`](./docs/postman/alquileres.postman_collection.json). La colección incluye registro, login, `/me`, listar equipos, crear equipo como administrador, crear alquiler, petición sin token y caso de usuario sin permisos.

1. Ejecuta `Register` o `Login cliente`; el token se guarda automáticamente como `token`.
2. Para la prueba de permisos, utiliza el token `CLIENTE` guardado en `token`.
3. Crea y configura un administrador inicial como se explicó arriba. Actualiza las credenciales del request `Login admin`, ejecútalo y se guardará `admin_token`.
4. Ejecuta `Crear equipo (ADMIN)` con ese token y `Crear alquiler` con el token del cliente. Antes, crea el equipo y ajusta sus IDs/fechas si es necesario.
5. Las peticiones privadas usan `Authorization: Bearer {{token}}` o `{{admin_token}}`. `Sin token` omite deliberadamente el encabezado.

## Errores HTTP

- `400`: JSON o datos inválidos.
- `401`: token ausente/inválido o credenciales incorrectas.
- `403`: usuario autenticado sin el rol necesario.
- `404`: recurso no encontrado o alquiler no visible para el cliente.
- `409`: email/equipo duplicado o stock insuficiente.
