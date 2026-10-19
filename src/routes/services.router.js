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

//Buscar un servicio por id

router.get("/:sid", async (req, res) => {
    const service = await manager.getServiceById(req.params.sid);   //("2", como texto)

    if (!service) {
        return res.status(404).json({error: "Servicio no encontrado."});    //404 No encontrado.
    }

    //si existe...
    res.status(200).json(service);
})

//POST -> crear un servicio
router.post("/", async (req, res) => {
    try{
        //req.body trae los datos; el manager valida y genera el di
        const newService = await manager.addService(req.body);
        res.status(201).json(newService);
       }
       catch(error)
       {
        //AddService lanza un error si faltan campos
        res.status(400).json({error: error.message});
       }
});

//Delete

router.delete("/:sid", async (req, res) =>{
    const deleted = await manager.deleteService(req.params.sid);

    if (!deleted) {
        return res.status(404).json({error: "Servicio no encontrado."});
    }

    res.status(200).json({message: "Servicio eliminado.", service: deleted});
});

export default router;


