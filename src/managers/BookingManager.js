import fs from "fs/promises";

//Campos que hay que mandar si o si al crear una reserva
//(status y services no estan: status tiene un valor por defecto y services arranca vacio).

const REQUIRED_FIELDS  = ["clientName", "clientEmail", "date", "time"];

//Crea un error con un codigo HTTP adjunto asi el router sabe que status responder

function createError (message, status)
{
    const error = new Error(message);
    error.status = status;
    return error;
}

export default class BookingManager {
    //Recibe la ruta del JSON de reservas y el ServiceManager,
    //Porq para agregar un servicio a una reserva hayq ue verificar q el servicio exista.
    constructor(filePath, serviceManager) 
    {
        this.filePath = filePath;
        this.serviceManager = serviceManager;
    }

//-------Metodos auxiliares(privados)------

async #readFile(){
    try{
        const content = await fs.readFile(this.filePath, "utf-8");
        return JSON.parse(content);
    }catch(error)
    {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

async #saveFile(bookings) {
    await fs.writeFile(this.filePath, JSON.stringify(bookings, null, 2));
}

//----Metodos publicos----

//Crea una reserva. el id se genera acá y services siempre arranca vacío.
async createBooking(bookingData) {
    const missingFields = REQUIRED_FIELDS.filter(
        (field) => 
            bookingData?.[field] === undefined ||
            bookingData?.[field] === null ||
            bookingData?.[field] === ""
    );

    if (missingFields.length > 0) {
        throw createError(`Reserva incompleta. Faltan: ${missingFields.join(", ")}`, 400);
    }

    //Chequeo simple de email 
     if (!/^\S+@\S+\.\S+$/.test(bookingData.clientEmail)) {
            throw createError("El clientEmail no es válido.", 400);
        }

        const bookings = await this.#readFile();
        const lastId = bookings.reduce((max, b) => Math.max(max, b.id), 0 );

        const newBooking = {
            id : lastId + 1,
            clientName : bookingData.clientName,
            clientEmail : bookingData.clientEmail,
            date : bookingData.date,
            time : bookingData.time,
            status : bookingData.status ?? "pending", //si no mandan status, queda "pending"
            services : [],
        };

        bookings.push(newBooking);
        await this.#saveFile(bookings);
        return newBooking;
}

//Devuelve una reserva por id, o null si no existe
async getBookingById(id) {
    const bookings = await this.#readFile();
    const booking = bookings.find((b) => b.id === Number(id));
    return booking || null;
}

//Agrega un servicio a una reserva. Si ya estaba, suma 1 a quantity.

async addServiceToBooking (bid, sid) {
    const bookings = await this.#readFile();
    const booking = bookings.find((b) => b.id === Number(bid));

    if (!booking) {
        throw createError("Reserva no encontrada.", 404);
    }

    const service = await this.serviceManager.getServiceById(sid);

    if (!service)     
    {
        throw createError("Servicio no encontrado.", 404);
    }
        //Ese servicio ya esta dentro de la reserva?
        const item = booking.services.find((s) => s.service === service.id);

        if (item) {
            item.quantity += 1;
        }else
        {
            booking.services.push({service: service.id, quantity: 1});
        }

        //booking es  un objeto q esta dentro de bokings, asi que al modificarlo ya modificamos la lista. solo falta guardarla

        await this.#saveFile(bookings);
        return booking;
}
}