import {Router} from "express";
import {
    getServices, 
    getServicesById,
    creatService,
    updateService,
    deleteService,
} from "../controllers/bookings.controller.js";


const router = Router();        // = router = express.Router();

//Get/api/services
router.get("/", getServices);

//Buscar un servicio por id
router.get("/:sid", getServicesById);

//POST -> crear un servicio
router.post("/", creatService);

//Delete
router.delete("/:sid", deleteService);

//PUT -> actualizar un servicio
router.put("/:sid", updateService);
    
export default router;


