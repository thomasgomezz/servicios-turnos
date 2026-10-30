
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);


import mongoose from "mongoose";
import config from "./env.config.js";



//Conecta con mongoDB atlas. si falla, corta la app con un mensaje claro
export const connectDB = async() => {
    try{
        await mongoose.connect(config.mongoUri);
        console.log("Conectado a MongoDB");
    }catch(error)
    {
        console.log("Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
};