import {Router} from "express";
import path from "path";
import { fileURLToPath } from "url";
import ServiceManager from "../managers/ServiceManager.js";

//En ESM no existe __dirname, asi que lo armamos igual que en app.js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manager = new ServiceManager(
    path.join(__dirname, "..","data","services.json")    //path.join arma la rua al JSON partiendo de la carpeta del router
);

const router = Router();        // = router = express.Router();
//Crea el router vacio, abajo vamos agregando rutas.


//Get/api/services

router.get("/", async(req, res) => {
    const {category, available } = req.query; //Los filtros vienen en req.query
    //asincrona porq adentro usamos await.req

    let services = await manager.getServices();  //Pide todos los servicios del manager
    //Let porq la lista la vamos filtrando y reasignando

    if(category) {
        services = services.filter(
            (s) => s.category.toLowerCase() == category.toLowerCase()
        );
    }

    if (available !== undefined) {  //En la URL todo llega como texto (true/false), por eso convertimos a string
        services = services.filter((s) => String(s.available) === available);
    }
     
    res.status(200).json(services); //Responde con un codigo 200(Ok)
});

export default router;



