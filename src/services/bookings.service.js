import bookingsRepository from "../repositories/bookings.repository.js";
import servicesService  from "./services.service.js"

//-----------------------------------------------------------
//Service -> contiene reglas de negocio, no conoce req, res
//-----------------------------------------------------------

//Campos que hay que mandar si o si al crear una reserva
//(status y services no estan: status tiene un valor por defecto y services arranca vacio)
const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"]
//Crea un error con un type
function createError(message, type)
{
    const error = new Error(message);
    error.type = type;
    return error;
}

class BookingsService {
    //Crea una reserva. Aplica las reglas: campos obligatorios, email valido
    //status por defecto "pending" y services siempre vacio al nacer

    async createBooking(bookingData)
    {
        //missing fields -> campos faltantes
        const missingFields = REQUIRED_FIELDS.filter(
            (field) =>
                bookingData?.[field] === undefined ||
                bookingData?.[field] === null ||
                bookingData?.[field] === ""
        );

        if (missingFields.length > 0) 
        {
            throw createError(
                `Reserva incompleta. Faltan: ${missingFields.join(", ")}`,
                "validation"
            );
        }

        //Chequeo simple de mail
        if (!/^\S+@\S+\.\S+$/.test(bookingData.clientEmail)) {
            throw createError("El clientEmail no es válido.", "validation");
        }

        //Armamos la reserva con los campos permitidos
        const newBooking = {
            clientName: bookingData.clientName,
            clientEmail: bookingData.clientEmail,
            date: bookingData.date,
            time: bookingData.time,
            status: bookingData.status ?? "pending",  //Si no manda status, queda "pending"
            services: [],
        };

        return await bookingsRepository.create(newBooking);
    }


    //Devuelve una reserva por id
    async getBookingById(id)
    {
        const booking = await bookingsRepository.getById(id);

        if (!booking) {
            throw createError("Reserva no encontrada.", "not_found");
        }

        return booking;
    }

    //Agrega un servicio a una reserva, si ya está... suma 1 a quantity
    async addServiceToBooking(bid, sid)
    {
        //1 existe la reserva? 
        const booking = await this.getBookingById(bid);

        //2- existe el servicio? 
        const service = await servicesService.getServiceById(sid);

        //3-si es servicio ya estaba.... se incrementa quantity
        const item = booking.services.find((s) => s.service === service.id);

        if (item) {
            item.quantity += 1;
        }else {
            booking.service.push({service: service.id, quantity: 1});
        }

        return await bookingsRepository.update(booking.id, booking);
    }
}

export default new BookingsService();
