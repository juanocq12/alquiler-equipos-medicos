# Alcance ABP aplicado — semanas 1 a 8

Referencia breve de cómo se aplica al dominio de alquiler de equipos médicos lo aprendido hasta Semana 8. No reemplaza las guías oficiales ni el enunciado separado del Parcial 1.

Guía oficial consultada: [Programación web 2 — material del curso](https://static.blobhive.com/web2-estudiantes.html).

| Semana | Concepto | Evidencia en el proyecto |
| --- | --- | --- |
| 1 | HTTP, solicitudes y respuestas | API JSON, métodos REST y códigos de estado. |
| 2 | Arquitectura y modelado del dominio | Casos de uso, clases, secuencia y proceso BPMN en esta carpeta. |
| 3 | Node.js, módulos y asincronía | JavaScript ESM y operaciones asíncronas en rutas, controladores y servicios. |
| 4 | Express y capas | Separación de `src/routes`, `src/controllers` y `src/services`. |
| 5 | REST, validación y errores | `express-validator`, `ErrorHttp` y middleware central. |
| 6 | PostgreSQL y Prisma | Modelos relacionales y migración versionada en `prisma/`. |
| 7 | Relaciones, seed y transacción | Relaciones Usuario/Alquiler y Alquiler/AlquilerItem/Equipo; seed repetible y alquiler atómico con error de stock `409`. |
| 8 | bcrypt, JWT y roles | Registro/login, `requireAuth`, `requireRole`, protección de rutas y secretos en `.env`. |

## Hitos del proyecto ABP

- **Hito 1 · Semana 2:** dominio, equipo, diagramas de casos de uso, clases, secuencia y BPMN; README inicial. Los diagramas de dominio están en [`hito-1-modelado.md`](./hito-1-modelado.md). El archivo declara el trabajo individual reportado y deja explícito que debe confirmarse con el profesor, porque la guía describe equipos de 2 a 3 personas.
- **Hito 2 · Semana 7:** API PostgreSQL + Prisma 7, capas, validación, relación 1-N, transacción con conflicto y rollback, seed repetible, Postman y README desde cero.
- **Semana 8:** autenticación con bcrypt/JWT y autorización por roles se aplican al ABP como avance técnico. La guía del curso también describe un Parcial 1 distinto, con enunciado propio; no se confunde esa evaluación con este proyecto.

La secuencia exacta de instalación está en el [README del repositorio](../../README.md).
