import {Router} from "express";
import {
    getServices, 
    getServiceById,
    createService,
    updateService,
    deleteService,
} from "../controllers/services.controller.js";


const router = Router();        // = router = express.Router();

//Get/api/services
router.get("/", getServices);

//Buscar un servicio por id
router.get("/:sid", getServiceById);

//POST -> crear un servicio
router.post("/", createService);

//Delete
router.delete("/:sid", deleteService);

//PUT -> actualizar un servicio
router.put("/:sid", updateService);
    
export default router;


