# Alquiler de equipos médicos — avance ABP hasta Semana 8

API REST de alquiler de equipos médicos construida en JavaScript con Node.js, Express, PostgreSQL y Prisma 7. El dominio, sus relaciones y la operación transaccional de alquiler se acompañan de autenticación JWT y roles `CLIENTE`/`ADMIN`.

## Relación con el curso

El detalle de alcance por semana e hitos ABP está en [`docs/abp/alcance-semanas-1-8.md`](./docs/abp/alcance-semanas-1-8.md).

| Semana | Aplicación en este repositorio |
| --- | --- |
| 1 | Comunicación HTTP: API JSON, métodos y respuestas HTTP. |
| 2 | Dominio y proceso modelados en [`docs/abp/hito-1-modelado.md`](./docs/abp/hito-1-modelado.md) y [`docs/abp/proceso-alquiler.bpmn`](./docs/abp/proceso-alquiler.bpmn). Completar allí los nombres reales del equipo. |
| 3 | JavaScript moderno, módulos ES y operaciones asíncronas con Node.js. |
| 4 | Express y separación `routes → controllers → services`. |
| 5 | API REST, validación de entradas y middleware central de errores HTTP. |
| 6 | PostgreSQL, Prisma 7, esquema, migraciones y cliente generado. |
| 7 | Relaciones, seed re-ejecutable, lectura sin exponer hashes y alquiler transaccional con respuesta `409` y rollback. |
| 8 | Registro/login con bcrypt y JWT, middleware de autenticación y autorización por roles. |

El Parcial 1 de la guía es una evaluación distinta del proyecto ABP. Este repositorio sigue siendo el dominio elegido para el ABP.

## Requisitos

- Node.js 20.19 o superior
- Docker Desktop con Compose
- npm

Las versiones de Prisma y del adaptador PostgreSQL están fijadas en `package.json` y `package-lock.json`.

## Arranque desde cero

En una terminal de PowerShell dentro de la carpeta del proyecto:

```powershell
Copy-Item .env.example .env
npm install
docker compose up -d
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run dev
```

La API queda en `http://localhost:3000` (o el `PORT` de `.env`). La base local de Docker se publica en `localhost:5434`, base `alquiler`, usuario `campuseats`. El puerto 5434 evita interferir con otros PostgreSQL locales en 5432/5433. `DATABASE_URL` del ejemplo coincide con `docker-compose.yml`. No subas `.env` ni uses `docker compose down -v` si quieres conservar los datos.

Para desarrollo con cambios en el esquema, ejecuta `npm run prisma:migrate -- --name nombre_del_cambio` para crear y aplicar una migración. En un clon normal, usa las migraciones ya versionadas con `migrate deploy`.

### Datos de desarrollo

El seed usa `upsert` y se puede repetir:

```bash
npx prisma db seed
```

Crea dos cuentas de desarrollo y cinco equipos. Credenciales iniciales locales:

- Admin: `admin@alquiler.local` / `Admin123!`
- Cliente: `cliente@alquiler.local` / `Cliente123!`

No uses estas contraseñas en producción. El seed no sobrescribe las contraseñas ni el stock de registros que ya existen.

## Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Público; siempre crea rol `CLIENTE` |
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/auth/me` | Autenticado |
| `GET` | `/api/equipos` | Autenticado |
| `GET` | `/api/equipos/:id` | Público |
| `POST`, `PUT`, `DELETE` | `/api/equipos` y `/api/equipos/:id` | Solo `ADMIN` |
| `GET` | `/api/usuarios` y `/api/usuarios/:id` | Solo `ADMIN` |
| `POST` | `/api/usuarios` | Solo `ADMIN` |
| `GET` | `/api/alquileres` y `/api/alquileres/:id` | Autenticado; `CLIENTE` solo ve los propios |
| `POST` | `/api/alquileres` | Autenticado; usuario derivado del token |

Las rutas con entrada validan los parámetros, consulta o cuerpo antes de ejecutar la lógica. Las respuestas nunca incluyen `passwordHash`. El cliente solicita las fechas y equipos; no puede enviar un `usuarioId` distinto para crear un alquiler.

### Operación transaccional

`POST /api/alquileres` comprueba el usuario, las fechas, los equipos y el stock; calcula el total; descuenta existencias con una actualización condicional; y crea el alquiler y sus items dentro de una transacción. Las cantidades repetidas del mismo equipo se suman para validar disponibilidad. Si falta stock, responde `409` y no deja cambios parciales en la base.

## Roles y códigos HTTP

- `CLIENTE`: consulta el catálogo autenticado, crea alquileres y solo puede leer sus propios alquileres.
- `ADMIN`: gestiona equipos y consulta/crea usuarios.
- `400`: JSON o datos inválidos.
- `401`: credenciales o token ausentes/inválidos.
- `403`: usuario autenticado sin el rol requerido.
- `404`: recurso no encontrado o alquiler no visible para el cliente.
- `409`: email/equipo duplicado o stock insuficiente.

## Probar con Postman

Importa [`docs/postman/alquileres.postman_collection.json`](./docs/postman/alquileres.postman_collection.json).

1. Ejecuta `Login cliente` con los datos del seed, o `Register cliente`; la colección guarda el token de cliente.
2. Ejecuta `Login admin` con la cuenta del seed; se guarda `admin_token`.
3. Prueba `/me`, listado de equipos, creación de equipo como admin y creación de alquiler como cliente.
4. `Sin token` debe responder `401`; `Sin permisos` debe responder `403`.
5. Para comprobar rollback, solicita más unidades de las disponibles: debe responder `409` y el stock debe permanecer igual.

## Estado y revisión del equipo

- La implementación ABP hasta Semana 8 y sus instrucciones están en este repositorio.
- El documento de Hito 1 identifica a Juan Correa como integrante en modalidad individual autorizada.
- Antes de entregar, prueben el procedimiento de arranque en un clon limpio y comprueben los IDs/datos de Postman.
