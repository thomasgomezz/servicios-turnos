import path from "path";
import { fileURLToPath } from "url";
import config from "./config/env.config.js"
import ServiceManager from "./managers/ServiceManager.js";
import { cwd } from "process";

//En ESM no existe __dirname, asi q lo armamos a mano.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manager = new ServiceManager(path.join(__dirname, "data", "services.json"));

console.log(`Entorno: ${config.nodeEnv} | Puerto configurado: ${config.port}\n`);

//Pequeña demo para probar todos los metodos
console.log("1)Todos los servicios:");
console.log(await manager.getServices());

console.log("\n2) Servicio con id 1:");
console.log(await manager.getServiceById(1));

console.log("\n3) Servicio inexistente (id 999):");
console.log(await manager.getServiceById(999));


console.log("\n4) Agregar un servicio:");
const created = await manager.addService({
  name: "Depilación",
  description: "Depilación con cera",
  duration: 40,
  price: 7000,
  category: "Estética",
  available: true,
});
console.log(created);

console.log("\n5) Agregar un servicio incompleto:");
try {
  await manager.addService({ name: "Solo nombre" });
} catch (error) {
  console.log(error.message);
}

console.log("\n6) Actualizar el servicio (intentando cambiar el id):");
console.log(await manager.updateService(created.id, { id: 500, price: 7500 }));

console.log("\n7) Eliminar el servicio creado:");
console.log(await manager.deleteService(created.id));

console.log("\n8) Eliminar uno que no existe:");
console.log(await manager.deleteService(999));

