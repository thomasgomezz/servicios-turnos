import {Router} from "express";
import {
    createBooking, 
    getBookingById,
    addServiceToBooking,
} from "../controllers/bookings.controller.js";

const router = Router();

//POST / api/bookings -> crear una reserva
router.post("/", createBooking);

//GET /api/bookings/:bid -> una reserva por id
router.get("/:bid", getBookingById);

// POST /api/bookings/:bid/servicess/:sid -> agregar un servicio a la reserva
router.post("/:bid/services/:sid", addServiceToBooking);

export default router;

