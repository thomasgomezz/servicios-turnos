# Servicios Turnos

API REST hecha con Node.js, Express y ESM para gestionar los servicios de un sistema de turnos y reservas. La lógica vive en la clase `ServiceManager`, que guarda los servicios en un archivo JSON, y las rutas están en un router de Express.

## Instalación

```bash
git clone https://github.com/thomasgomezz/servicios-turnos.git
cd servicios-turnos
npm install
cp .env.example .env
```

Después abrí el archivo `.env` y completá los valores (ver sección siguiente).

## Variables de entorno

| Variable   | Descripción             | Ejemplo       |
| ---------- | ----------------------- | ------------- |
| `PORT`     | Puerto de la aplicación | `8080`        |
| `NODE_ENV` | Entorno de ejecución    | `development` |

Si falta alguna, la app no arranca y muestra un mensaje indicando cuál es.

## Ejecución

```bash
npm start
```

Esto corre `src/app.js` y levanta el servidor en el puerto definido en `PORT`. Con el valor de ejemplo, la API queda en `http://localhost:8080/api/services`.

## Recurso `services`

Los servicios se guardan en `src/data/services.json`. Cada servicio tiene esta forma:

```js
{
  id: 1,                       // se genera automáticamente
  name: "Corte de pelo",
  description: "Corte clásico con lavado incluido",
  duration: 30,                // minutos
  price: 5000,
  category: "Peluquería",
  available: true
}
```
## Endpoints

Ruta base: `/api/services`

| Método | Ruta                | Descripción                                   | Respuestas        |
| ------ | ------------------- | --------------------------------------------- | ----------------- |
| GET    | `/api/services`     | Devuelve todos los servicios (acepta filtros) | 200               |
| GET    | `/api/services/:sid`| Devuelve un servicio por id                   | 200, 404          |
| POST   | `/api/services`     | Crea un servicio                              | 201, 400          |
| PUT    | `/api/services/:sid`| Actualiza un servicio                         | 200, 404          |
| DELETE | `/api/services/:sid`| Elimina un servicio                           | 200, 404          |

### Filtros en GET /api/services

Se pasan como query params y se pueden combinar:

- `category`: filtra por categoría (no distingue mayúsculas). Ejemplo: `?category=Estética`
- `available`: filtra por disponibilidad (`true` o `false`). Ejemplo: `?available=true`

Ejemplo combinado: `GET /api/services?category=Estética&available=false`

### Crear un servicio (POST)

El body va en formato JSON. El `id` se genera automáticamente: si lo enviás, se ignora. Si falta algún campo, responde 400.

```json
{
  "name": "Depilación",
  "description": "Depilación con cera",
  "duration": 40,
  "price": 7000,
  "category": "Estética",
  "available": true
}
```

### Actualizar un servicio (PUT)

Se envían solo los campos a modificar. El `id` no se puede cambiar.

```json
{
  "price": 7500
}
```

### Ejemplo de errores

```json
{ "error": "Servicio no encontrado." }
```

## Recurso `bookings`

Las reservas se guardan en `src/data/bookings.json`. Cada reserva tiene esta forma:

```js
{
  id: 1,                          // se genera automáticamente
  clientName: "Juan Pérez",
  clientEmail: "juan@mail.com",
  date: "2026-11-05",
  time: "10:30",
  status: "pending",              // si no se envía, queda en "pending"
  services: [                     // arranca vacío
    { service: 1, quantity: 2 }   // id del servicio y cantidad
  ]
}
```

### Endpoints

Ruta base: `/api/bookings`

| Método | Ruta                                | Descripción                                    | Respuestas   |
| ------ | ----------------------------------- | ---------------------------------------------- | ------------ |
| POST   | `/api/bookings`                     | Crea una reserva (nace con `services` vacío)   | 201, 400     |
| GET    | `/api/bookings/:bid`                | Devuelve una reserva por id                    | 200, 404     |
| POST   | `/api/bookings/:bid/services/:sid`  | Agrega un servicio a una reserva existente     | 200, 404     |

### Crear una reserva (POST)

El `id` se genera automáticamente y `services` siempre arranca vacío. Los campos `clientName`, `clientEmail`, `date` y `time` son obligatorios, y el email tiene que ser válido. Si falta alguno, responde 400.

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@mail.com",
  "date": "2026-11-05",
  "time": "10:30"
}
```

### Agregar un servicio a una reserva

`POST /api/bookings/1/services/2` (sin body).

Valida que existan tanto la reserva como el servicio; si falta alguno, responde 404. Si el servicio ya estaba en la reserva, no se duplica: se suma 1 a `quantity`.

## Uso de `ServiceManager`

```js
import ServiceManager from "./managers/ServiceManager.js";

const manager = new ServiceManager("./src/data/services.json");

// Todos los servicios
await manager.getServices();

// Un servicio por id (devuelve null si no existe)
await manager.getServiceById(1);

// Agregar (el id se genera solo; lanza un error si faltan campos)
await manager.addService({
  name: "Depilación",
  description: "Depilación con cera",
  duration: 40,
  price: 7000,
  category: "Estética",
  available: true,
});

// Actualizar (el id no se puede modificar; devuelve null si no existe)
await manager.updateService(1, { price: 5500 });

// Eliminar (devuelve el servicio eliminado o null si no existe)
await manager.deleteService(1);
```

## Estructura

```
src/
  config/env.config.js          # carga y valida las variables de entorno
  managers/ServiceManager.js    # lógica de los servicios
  managers/BookingManager.js    # lógica de las reservas
  routes/services.router.js     # rutas de /api/services
  routes/bookings.router.js     # rutas de /api/bookings
  data/services.json            # datos de servicios
  data/bookings.json            # datos de reservas
  app.js                        # configura Express y levanta el servidor