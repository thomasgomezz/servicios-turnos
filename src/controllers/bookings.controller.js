import path from "path";
import { fileURLToPath } from "url";
import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager";
import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BookingManager = new BookingManager (
    path.join(__dirname, "..", "data", "bookings.json")
);

const ServiceManager = new ServiceManager(
    path.join(__dirname, "..", "data", "services.json")
);


//booking -> reserva
//services -> catalogo
//POST /api/bookings
export const createBooking = async (req, res) => {
    try{
        const newBooking = await BookingManager.createBooking(req.body);
        res.status(201).json({newBooking});
    }catch(error){
         // error.status lo pone el manager (400, 404). Si no tiene, es un error inesperado (500)
        res.status(400).json({error:error.message});
    }
};

//GET /api/bookings/:bid
export const getBookingById = async (req, res) => {
    const booking = await BookingManager.getBookingById(req.params.bid);

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
        const booking = await BookingManager.getBookingById(bid); 
        if (!booking) {
            return res.status(404).json({error: "Reserva no encontrada."});
        }

        //2- existe el servicio? (se valida con el serviceManager)
        const service = await ServiceManager.getBookingById(sid);
        if (!service) {
            return res.status(404).json({erorr: "Servicio no encontrado."});
        }

        //3- Ambos existen
        const updateBooking = await BookingManager.addServiceToBooking(bid, service.id);
        res.status(200).json(updateBooking);
       
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

