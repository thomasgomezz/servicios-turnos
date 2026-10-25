import path from "path";
import { fileURLToPath } from "url";
import ServieManager from "../managers/ServiceManager.js";

//En ESM no existe __dirname, asi que lo armamos

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//El controller crea el manager(apunta al JSON de servicios)
const manager = new ServieManager(
    path.join(__dirname, "..", "data", "services.json")
);

//GET /api/services/:sid
export const getServiceById = async (req, res) => {
    const service = await manager.getServiceById(req.params.sid);   //("2", como texto)

    if (!service) {
        return res.status(404).json({error: "Servicio no encontrado."});    //404 No encontrado.
    }

    //si existe...
    res.status(200).json(service);
}

//POST /api/services
export const creatService = async (req, res) => {
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
}

//PUT /api/services/:sid
export const updateService = async (req, res) => {
    try{
         const { id, ...dataToUpdate } = req.body ?? {};
         const updated = await manager.updateService(req.params.sid, dataToUpdate);

         if (!updated) {
        return res.status(404).json({error: "Servicio no encontrado."});
        }
        res.status(200).json(updated);
    }
    catch(error)
    {
        res.status(400).json({error: error.message});
    }    
}

//DELETE /api/services/:sid
export const deleteService = async (req,res) => {
    const deleted = await manager.deleteService(req.params.sid);
    
        if (!deleted) {
            return res.status(404).json({error: "Servicio no encontrado."});
        }
    
        res.status(200).json({message: "Servicio eliminado.", service: deleted});
}