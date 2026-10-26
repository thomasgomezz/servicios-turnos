import path from "path";
import { fileURLToPath } from "url";
import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bookingManager = new BookingManager (
    path.join(__dirname, "..", "data", "bookings.json")
);

const serviceManager = new ServiceManager(
    path.join(__dirname, "..", "data", "services.json")
);


//booking -> reserva
//services -> catalogo
//POST /api/bookings
export const createBooking = async (req, res) => {
    try{
        const newBooking = await bookingManager.createBooking(req.body);
        res.status(201).json(newBooking);
    }catch(error){
        res.status(400).json({error:error.message});
    }
};

//GET /api/bookings/:bid
export const getBookingById = async (req, res) => {
    const booking = await bookingManager.getBookingById(req.params.bid);

    if (!booking) {
        return res.status(404).json({error: "Reserva no encontrada."});
    }
    res.status(200).json(booking);
};

//POST /api/bookings/:bid/services/:sid
//Agregar un servicio a la reserva
export const addServiceToBooking = async (req, res) => {
    try{

        const {bid, sid} = req.params;

        //1 - existe la reserva? 
        const booking = await bookingManager.getBookingById(bid); 
        if (!booking) {
            return res.status(404).json({error: "Reserva no encontrada."});
        }

        //2- existe el servicio? (se valida con el serviceManager)
        const service = await serviceManager.getServiceById(sid);
        if (!service) {
            return res.status(404).json({error: "Servicio no encontrado."});
        }

        //3- Ambos existen
        const updateBooking = await bookingManager.addServiceToBooking(bid, service.id);
        res.status(200).json(updateBooking);
       
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

