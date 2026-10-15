# Programación web 2 · Material del curso (semanas 1 a 7)

**Código:** 238G8F · **Universidad de Caldas · 2026-2** · **Prof.** Cristian Echeverri
**Duración:** 18 semanas · **Sesión semanal:** 4 horas · **Créditos:** 3

> Backend profesional con Node.js, Express, PostgreSQL, tiempo real, microservicios, Docker, MCP y despliegue en la nube.

Fuente: <https://static.blobhive.com/web2-estudiantes.html>

> ⚠️ **Estado de esta copia:** las semanas **1 a 5** están completas. La **semana 6** está incompleta (la página original se cortó en el *Paso 3* de la Parte A) y la **semana 7** no se pudo extraer. Ver la [Semana 6](#semana-6--postgresql--prisma-i-persistencia-real-code-first) y la [Semana 7](#semana-7--prisma-ii-relaciones-consultas-y-transacciones).

## Índice

| Semana | Tema | Archivo |
| ------ | ---- | ------- |
| 1 | Internet y HTTP | [Semana 1](#semana-1--internet-y-protocolos-cómo-viaja-una-petición) |
| 2 | Arquitecturas y modelado | [Semana 2](#semana-2--arquitecturas-y-modelado-del-dominio) |
| 3 | Node.js a fondo | [Semana 3](#semana-3--nodejs-a-fondo-event-loop-módulos-y-servidor-http-nativo) |
| 4 | Express | [Semana 4](#semana-4--express-routing-middlewares-y-arquitectura-por-capas) |
| 5 | REST y validación | [Semana 5](#semana-5--rest-a-fondo-formatos-de-intercambio-y-validación) |
| 6 | PostgreSQL + Prisma I (parcial) | [Semana 6](#semana-6--postgresql--prisma-i-persistencia-real-code-first) |
| 7 | Prisma II: relaciones (pendiente) | [Semana 7](#semana-7--prisma-ii-relaciones-consultas-y-transacciones) |

---

## Presentación

Si en Web 1 aprendiste a construir lo que el usuario *ve*, en este curso construyes lo que *no ve* pero hace que todo funcione: el **backend**. Al terminar serás capaz de diseñar, construir, asegurar, dockerizar y desplegar en la nube una API completa con **Node.js y Express** (JavaScript puro, sin TypeScript), persistencia en **PostgreSQL con Prisma**, tiempo real con **Socket.IO**, una arquitectura de **microservicios** básica y un **servidor MCP** que conecta tu backend con modelos de IA.

## Información institucional (PIAA)

Plan Institucional de Actividad Académica, versión 2, código `R-2680-P-DC-774`.

| Ítem | Detalle |
| ---- | ------- |
| Programa | Ingeniería en Informática · Facultad de Inteligencia Artificial e Ingenierías |
| Tipo de actividad | Teórico-práctica · 36 h teóricas + 36 h prácticas |
| Dedicación | 72 h presenciales y 72 h no presenciales (relación 1/1): ~4 h semanales de trabajo autónomo |
| Requisitos | Programación web I (235G8F) · Bases de datos I (277G8F) |
| Nota aprobatoria | 3.0 · **La actividad no es habilitable** |
| Inasistencias | Se reprueba con 11 horas justificadas (15%) o 18 horas entre justificadas y no justificadas (25%). Con sesiones de 4 h son entre 3 y 4 sesiones |
| Cupo | 30 estudiantes |

## Metodología: ABP + aula invertida

- **Antes de clase:** lees el material de la semana (conceptos + código). Llegas con el software instalado y las dudas anotadas.
- **En clase (4 h):** teoría corta, luego práctica asesorada (el taller) y seguimiento de proyectos por equipos. El profesor construye en vivo el ejemplo guiado y tú aplicas lo mismo a tu dominio.
- **Después de clase:** tu equipo avanza el proyecto con la tarea de la semana.
- **Laboratorios de exploración:** cada semana hay experimentos cortos que comparan *dos variantes* del mismo problema. Regla: **predice primero, ejecuta después**, y luego revisas las respuestas.
- **Inglés técnico:** cada semana cierra con un *English corner*; la sustentación final incluye una sección en inglés.

> **Tip:** si faltas a una clase, el material permite seguir la semana por tu cuenta (código completo y ejecutable, talleres paso a paso). Pero el seguimiento del proyecto es presencial: avisa a tu equipo y al profesor.

## Resultados de aprendizaje

| Resultado | Dónde se construye |
| --------- | ------------------ |
| **R1 · Diseñar e implementar** soluciones mediante arquitecturas de microservicios y servicios backend robustos (eficiencia, seguridad, escalabilidad en la nube). *(RA2)* | Semanas 2, 11, 12 y 15 |
| **R2 · Optimizar** el tratamiento y la transferencia de información técnica mediante servicios REST, modelado del dominio e integración de bases de datos relacionales y no relacionales con ORM. *(RA1, RA3)* | Semanas 2, 4–7 y 12 |
| **R3 · Apropiar** estándares de seguridad y conducta ética: autenticación, autorización y cifrado. *(RA4)* | Semanas 8 y 14 y la política de IA del curso |
| **R4 · Desempeñarse** como miembro o líder de un equipo ABP, con comunicación oral y escrita en español e inglés. *(RA6)* | Todo el semestre |

## Evaluación (propuesta)

Los porcentajes definitivos se acuerdan con el grupo en la primera sesión.

| Componente | Momento | Peso |
| ---------- | ------- | ---- |
| Parcial 1 (semanas 1–7) | Semana 8 | 20% |
| Parcial 2 (semanas 8–13) | Semana 14 | 20% |
| Quices y talleres | Todo el semestre | 15% |
| Proyecto ABP · 3 avances | Semanas 2, 7 y 12 | 20% |
| Proyecto ABP · entrega y sustentación final | Semana 18 | 25% |

## El proyecto ABP

En equipos de **2 a 3 estudiantes** se construye la **API backend completa de un dominio real** elegido por el equipo (domicilios, reservas de canchas, citas veterinarias, biblioteca, eventos, marketplace universitario…). El ejemplo guiado del profesor es **CampusEats**: pedidos de comida en el campus, con usuarios con roles (cliente/admin), productos, pedidos con items, notificaciones en tiempo real, emails, un microservicio de pagos simulado, un servidor MCP y despliegue dockerizado en la nube.

| Hito | Semana | Qué se entrega |
| ---- | ------ | -------------- |
| Hito 1 · Dominio modelado | 2 | Equipo, dominio, diagramas UML (casos de uso, clases, secuencia) y BPMN del proceso principal |
| Hito 2 · Avance 1 | 7 | API CRUD funcional con PostgreSQL + Prisma, arquitectura por capas y colección de Postman |
| Hito 3 · Avance 2 | 12 | Auth JWT con roles, un servicio externo, Socket.IO y stack dockerizado con docker-compose |
| Entrega final + sustentación | 18 | Proyecto completo, seguro, documentado y desplegado en la nube. Demo en vivo con sección en inglés |

## Software requerido

- **Node.js LTS** (con nvm, semana 1)
- **Visual Studio Code**
- **Git** y cuenta en **GitHub**
- **Docker Desktop** (suave desde la semana 6, a fondo en la 12)
- **Postman** o Thunder Client
- Cuenta gratuita en **Render** o **Railway** (semana 15)

## Cronograma completo

| Semana | Tema | Entrega / hito |
| ------ | ---- | -------------- |
| 1 | Internet y protocolos: cómo viaja una petición. HTTP a fondo. Node + npm | — |
| 2 | Arquitecturas (monolito, SOA, microservicios) y modelado UML/BPMN | **Hito 1:** dominio modelado |
| 3 | Node.js a fondo: event loop, módulos, servidor HTTP nativo | — |
| 4 | Express: routing, middlewares, arquitectura por capas | — |
| 5 | REST a fondo, formatos de intercambio y validación | — |
| 6 | PostgreSQL + Prisma I (code-first). Relacional vs NoSQL | — |
| 7 | Prisma II: relaciones, consultas, transacciones | **Hito 2:** avance 1 (API CRUD con BD) |
| 8 | Autenticación con JWT y autorización por roles | **Parcial 1** (semanas 1–7) |
| 9 | Servicios externos: email, archivos, SMS/push, APIs de terceros | — |
| 10 | Tiempo real con WebSocket y Socket.IO | — |
| 11 | Microservicios en la práctica + API Gateway | — |
| 12 | Docker y docker-compose | **Hito 3:** avance 2 |
| 13 | MCP: conectar la IA a tu backend | — |
| 14 | Seguridad backend: OWASP, CORS, helmet, rate limiting | **Parcial 2** (semanas 8–13) |
| 15 | Despliegue en la nube + CI/CD con GitHub Actions | API en producción con URL pública |
| 16 | Calidad: errores, logs, tests y documentación Swagger | Presentación de arquitectura en inglés |
| 17 | Asesoría y cierre técnico | Checklist final aprobado |
| 18 | Sustentación final | **Entrega final + sustentación** |

## Bibliografía y referencias

**Institucional (PIAA):**

- Brown, E. (2019). *Web development with Node and Express: Leveraging the JavaScript stack* (2.ª ed.). O'Reilly Media. → semanas 3–5.
- Wolff, E. (2016). *Microservices: Flexible software architecture*. Addison-Wesley Professional. → semanas 2 y 11.
- Docker. (2023). *Docker: Accelerated container application development*. <https://www.docker.com/> → semanas 6 y 12.
- Git. (2023). *Pro Git book*. <https://git-scm.com/book/es/v2> → todo el semestre.
- Chan, J., Chung, R., & Huang, J. (2019). *Python API development fundamentals*. Packt · FastAPI (2023) <https://fastapi.tiangolo.com/> · LoopBack (2023) <https://loopback.io/> · Price, M. J. (2019). *C# 8.0 and .NET Core 3.0*. Packt.

El PIAA nombra varias pilas posibles (Node.js, Python/FastAPI, .NET). **Este curso implementa Node.js/Express**; las demás son lectura de contraste.

**Documentación de referencia:**

- [Node.js API](https://nodejs.org/docs/latest/api/) · [Express](https://expressjs.com/es/) · [Prisma](https://www.prisma.io/docs) · [PostgreSQL](https://www.postgresql.org/docs/current/)
- [Socket.IO](https://socket.io/docs/v4/) · [Docker](https://docs.docker.com/) · [Redis](https://redis.io/docs/latest/) · [Model Context Protocol](https://modelcontextprotocol.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/) · [The Twelve-Factor App](https://12factor.net/es/)
- [MDN — HTTP](https://developer.mozilla.org/es/docs/Web/HTTP) · [OpenAPI Specification](https://swagger.io/specification/)

El archivo continúa con todo el contenido de las semanas 1–6 y la parte disponible de la semana 6; la semana 7 está marcada como "contenido no disponible" en la copia. Si quieres puedo añadir notas faltantes o dejar un marcador para que peguen el texto original de la semana 7 cuando lo tengas.
