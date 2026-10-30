# Servicios Turnos

API REST hecha con Node.js, Express y ESM para gestionar los servicios y las reservas de un sistema de turnos. Está organizada en una arquitectura en capas (router → controller → service → repository → DAO) y persiste los datos en mongoDB Atlas con Mongoose.

## Instalación

```bash
git clone https://github.com/thomasgomezz/servicios-turnos.git
cd servicios-turnos
npm install
cp .env.example .env
```

Después abrí el archivo `.env` y completá los valores (ver sección siguiente).

Para que la API funcione hace falta un cluster en [MongoDB Atlas](https://www.mongodb.com/atlas) (el plan gratuito alcanza). La URI de conexión se carga en el archivo `.env` como `MONGO_URI`.

## Variables de entorno

| Variable   | Descripción             | Ejemplo       |
| ---------- | ----------------------- | ------------- |
| `PORT`     | Puerto de la aplicación | `8080`        |
| `NODE_ENV` | Entorno de ejecución    | `development` |
| `MONGO_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://usuario:clave@cluster.mongodb.net/turnos` |

Si falta alguna, la app no arranca y muestra un mensaje indicando cuál es.

## Ejecución

```bash
npm start
```

Esto corre `src/server.js` y levanta el servidor en el puerto definido en `PORT`. Con el valor de ejemplo, la API queda en `http://localhost:8080/api/services`.

## Recurso `services`

Los servicios se guardan en MongoDB, en la colección `services`. Cada servicio tiene esta forma:

```js
{
  _id: "6ae4a0f3341b572a56fd600c",   // lo genera MongoDB
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
| DELETE | `/api/services/:sid`| Elimina un servicio                           | 200, 400, 404          |

### Filtros en GET /api/services

Se pasan como query params y se pueden combinar:

- `category`: filtra por categoría (no distingue mayúsculas). Ejemplo: `?category=Estética`
- `available`: filtra por disponibilidad (`true` o `false`). Ejemplo: `?available=true`

Ejemplo combinado: `GET /api/services?category=Estética&available=false`

### Crear un servicio (POST)

El body va en formato JSON. El `_id` se genera automáticamente: si lo enviás, se ignora. Si falta algún campo, responde 400.

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

Se envían solo los campos a modificar. El `_id` no se puede cambiar.

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

Las reservas se guardan en mongoDB, en la coleccion bookings. Cada reserva tiene esta forma:

```js
{
  _id: "6ae4a7be03cf400bc3229051",   // lo genera MongoDB
  clientName: "Juan Pérez",
  clientEmail: "juan@mail.com",
  date: "2026-11-05",
  time: "10:30",
  status: "pending",              // si no se envía, queda en "pending"
  services: [                     // arranca vacío
       { service: "6ae4a0f3341b572a56fd600c", quantity: 2 }   // ObjectId del servicio y cantidad
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

El `_id` se genera automáticamente y `services` siempre arranca vacío. Los campos `clientName`, `clientEmail`, `date` y `time` son obligatorios, y el email tiene que ser válido. Si falta alguno, responde 400.

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@mail.com",
  "date": "2026-11-05",
  "time": "10:30"
}
```

### Agregar un servicio a una reserva

`   POST /api/bookings/<id de la reserva>/services/<id del servicio>` (sin body).

Valida que existan tanto la reserva como el servicio; si falta alguno, responde 404. Si el servicio ya estaba en la reserva, no se duplica: se suma 1 a `quantity`.

## Arquitectura en capas

El proyecto separa las responsabilidades en capas. Cada una solo se comunica con la que tiene debajo:

```
  router → controller → service → repository → DAO → MongoDB 
```

| Capa | Responsabilidad | Qué NO hace |
| ---- | --------------- | ----------- |
| **Router** (`routes/`) | Define los endpoints y los conecta con su controller | No tiene lógica |
| **Controller** (`controllers/`) | Lee `req`, llama al service y responde con `res` | No accede a datos ni aplica reglas de negocio |
| **Service** (`services/`) | Contiene las reglas de negocio: validaciones, filtros, regla de `quantity` | No conoce `req` ni `res` |
| **Repository** (`repositories/`) | Ofrece métodos de acceso a datos (`getAll`, `getById`, `create`, `update`, `delete`) | No tiene reglas de negocio |
| **DAO** (`dao/`) | Consulta y escribe directamente en MongoDB usando los modelos de Mongoose | No tiene lógica de negocio |

### Ejemplo del flujo: agregar un servicio a una reserva

`POST /api/bookings/<id de la reserva>/services/<id del servicio>`

1. El **router** deriva la request a `addServiceToBooking` del controller.
2. El **controller** lee `bid` y `sid` de `req.params` y llama al service.
3. El **service** valida que existan la reserva y el servicio, y aplica la regla de negocio: si el servicio ya estaba en la reserva, suma 1 a `quantity`; si no, lo agrega con `quantity: 1`.
4. El **repository** recibe la reserva ya modificada y se la pasa al DAO.
5. El **DAO** guarda el cambio en la coleccion booking de MongoDB.

### Manejo de errores

El service no conoce HTTP: lanza errores con un `type` (`validation` o `not_found`). El controller traduce ese tipo al código de respuesta (400 o 404).

### ¿Por qué esta estructura?

Esta separación permitió migrar de archivos JSON a MongoDB cambiando solo los DAO y agregando los modelos de Mongoose. El service, el controller y las rutas no se tocaron.

## Estructura

```
src/
  config/env.config.js                  # carga y valida las variables de entorno
  config/db.config.js                   # conexión a MongoDB
  controllers/services.controller.js    # recibe la request de services y responde
  controllers/bookings.controller.js    # recibe la request de bookings y responde
  services/services.service.js          # reglas de negocio de los servicios
  services/bookings.service.js          # reglas de negocio de las reservas
  repositories/services.repository.js   # acceso a datos de servicios
  repositories/bookings.repository.js   # acceso a datos de reservas
  dao/services.dao.js                   # consultas a MongoDB (servicios)
  dao/bookings.dao.js                   # consultas a MongoDB (reservas)
  models/service.model.js               # modelo de Mongoose: servicios
  models/booking.model.js               # modelo de Mongoose: reservas
  models/message.model.js               # modelo de Mongoose: mensajes
  routes/services.router.js             # define las rutas de /api/services
  routes/bookings.router.js             # define las rutas de /api/bookings
  app.js                                # configura Express y monta los routers
  server.js                             # conecta con MongoDB y levanta el servidor
  ```