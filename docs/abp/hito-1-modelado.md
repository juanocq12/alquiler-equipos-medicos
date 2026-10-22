# Hito 1 — Dominio y modelado

## Equipo y dominio

- **Dominio elegido:** alquiler de equipos médicos.
- **Integrante reportado:** Juan Correa (trabajo individual actualmente). La guía del ABP indica equipos de 2 a 3 personas; confirmar con el profesor si esta modalidad individual está autorizada antes de presentar el hito.
- **Proceso principal:** un cliente autenticado solicita uno o más equipos para un rango de fechas. El sistema valida el usuario, las fechas, la existencia y el stock; si hay disponibilidad, registra el alquiler y descuenta el inventario. Si no, rechaza la operación sin modificar la base.

## Casos de uso

```mermaid
flowchart LR
    cliente[Actor: Cliente]
    admin[Actor: Administrador]
    sistema((API de alquiler de equipos médicos))
    cliente -->|Registrarse / iniciar sesión| sistema
    cliente -->|Consultar catálogo| sistema
    cliente -->|Crear alquiler| sistema
    cliente -->|Consultar sus alquileres| sistema
    admin -->|Gestionar equipos| sistema
    admin -->|Consultar usuarios y alquileres| sistema
```

## Diagrama de clases del dominio

```mermaid
classDiagram
    class Usuario {
      +Int id
      +String nombre
      +String email
      +String passwordHash
      +Role rol
      +DateTime createdAt
    }
    class Equipo {
      +Int id
      +String nombre
      +String descripcion
      +Int precioDia
      +Int stock
    }
    class Alquiler {
      +Int id
      +Int usuarioId
      +DateTime fechaInicio
      +DateTime fechaFin
      +Int total
      +EstadoAlquiler estado
      +DateTime createdAt
    }
    class AlquilerItem {
      +Int id
      +Int alquilerId
      +Int equipoId
      +Int cantidad
      +Int precioDia
    }
    Usuario "1" --> "0..*" Alquiler : solicita
    Alquiler "1" *-- "1..*" AlquilerItem : contiene
    Equipo "1" --> "0..*" AlquilerItem : se alquila en
```

`AlquilerItem` resuelve la relación muchos-a-muchos entre alquileres y equipos y conserva el precio diario aplicado al momento de la solicitud.

## Diagrama de secuencia de la operación principal

```mermaid
sequenceDiagram
    actor Cliente
    participant API as Ruta y controlador
    participant Servicio as Servicio de alquileres
    participant DB as PostgreSQL / Prisma
    Cliente->>API: POST /api/alquileres + JWT + equipos/fechas
    API->>API: Validar token y datos de entrada
    API->>Servicio: crearAlquiler(usuario autenticado, datos)
    Servicio->>DB: Iniciar transacción
    Servicio->>DB: Validar usuario, equipos y stock
    alt Hay stock suficiente
        Servicio->>DB: Descontar stock condicionalmente
        Servicio->>DB: Crear alquiler e items
        Servicio->>DB: Confirmar transacción
        API-->>Cliente: 201 alquiler creado
    else Fecha, equipo o stock inválido
        Servicio->>DB: Revertir transacción
        API-->>Cliente: 400 / 404 / 409
    end
```

## Proceso BPMN

El archivo [`proceso-alquiler.bpmn`](./proceso-alquiler.bpmn) describe el proceso con eventos, tareas, compuerta de disponibilidad y salidas de éxito o conflicto.
