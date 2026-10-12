# Servicios Turnos

Administrador de servicios para un sistema de turnos y reservas, hecho con Node.js y ESM. Incluye la clase `ServiceManager`, que permite consultar, agregar, actualizar y eliminar servicios guardados en un archivo JSON.

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

Esto corre `src/app.js`, que muestra un ejemplo de uso de todos los métodos.

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
  config/env.config.js        # carga y valida las variables de entorno
  managers/ServiceManager.js  # lógica de los servicios
  data/services.json          # datos
  app.js                      # ejemplo de uso
```