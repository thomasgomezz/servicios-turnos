import dotenv from "dotenv";

//Lee el archivo .env y carga sus variables en process.env
dotenv.config();

//variables que la app necesita si o si para arrancar
const requireVars = ["PORT", "NODE_ENV", "MONGO_URI"];

//Buscamos cuales no estan definidas (o estan vacias)
const missingVars = requireVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
    console.error(
        `Error de configuración: faltan las variables de entorno: ${missingVars.join(", ")}.\n` +
      "Copiá .env.example a .env y completá los valores."
    );
    process.exit(1); //corta la app
}

//Exportamos la configuracion lista para usar en el resto del proyecto
export default {
    port: process.env.PORT,
    nodeEnv : process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI,
};
