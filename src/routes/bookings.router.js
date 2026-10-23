import {Router} from "express";
import path from "path";
import { fileURLToPath } from "url";
import serviceManager from "../managers/ServiceManager";
import bookingManager from "../managers/BookingManager";
import { error } from "console";
import { resolveObjectURL } from "buffer";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceManager = new serviceManager(
    path.join(__dirname, "..", "data", "services.json")
);
const manager = new bookingManager(
    path.join(__dirname, "..", "data", "bookings.json")
);

const router = Router();

//POST / api/bookings -> crear una reserva

router.post("/", async (req, res) => { 
    try{
        const newBooking = await manager.createBooking(req.body);
        res.status(201).join({error: error.message});
    }catch(error){
         // error.status lo pone el manager (400, 404). Si no tiene, es un error inesperado (500)
        res.status(error.status || 500).json({error:error.message});
    }
});

//GET /api/bookings/:bid -> una reserva por id
router.get("/:bid", async (req, res) => {
    const booking = await manager.getBookingById(req.params.bid);

    if (!booking) {
        return res.status(404).json({error: "Reserva no encontrada."});
    }
    res.status(200).json(booking);
});

// POST /api/bookings/:bid/servicess/:sid -> agregar un servicio a la reserva
router.post("/:bid/services/:sid", async (req, res) => {
    try{
        const bookings = await manager.addServiceToBooking(req.params.bid, req.params.sid);
        res.status(200).json(booking);
    }catch(error){
        res.status(error.status || 500).json({error: error.message});
    }
});

export default router;

