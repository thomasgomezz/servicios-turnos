import bookingsService from "../services/bookings.service.js";

//--------------------------------------------------------------
//Controller -> lee el req, llama al servicio y responde el res
//--------------------------------------------------------------

const STATUS_BY_TYPE = {
    validation: 400,
    not_found : 404,
};

const handlerError = (res, error) =>
{
    const status = STATUS_BY_TYPE[error.type] || 500; //si no tiene type, es un error inesperado
    res.status(status).json({error: error.message});
};

//POST /api/bookings
export const createBooking = async (req, res) => {
    try{
        const newBooking = await bookingsService.createBooking(req.body);
        res.status(201).json(newBooking);
    }catch(error){
        handlerError(res, error);
    }
};

//GET /api/bookings/:bid
export const getBookingById = async (req, res) => {
    try
    {
        const booking = await bookingsService.getBookingById(req.params.bid);
    res.status(200).json(booking);
    }catch(error)
    {
        handlerError(res, error);
    }
};

//POST /api/bookings/:bid/services/:sid
//Agregar un servicio a la reserva
export const addServiceToBooking = async (req, res) => {
    try{
        const {bid, sid} = req.params;
        const updatedBooking = await bookingsService.addServiceToBooking(bid, sid);
        res.status(200).json(updatedBooking);
    }catch(error){
        handlerError(res, error);
    }
};
