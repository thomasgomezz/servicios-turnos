import fs from "fs/promises";

//Campos que hay que mandar si o si al crear una reserva
//(status y services no estan: status tiene un valor por defecto y services arranca vacio).

const REQUIRED_FIELDS  = ["clientName", "clientEmail", "date", "time"];

export default class BookingManager {
    constructor(filePath) 
    {
        this.filePath = filePath;
    }

//---Metodos auxiliares (privados)----

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
        throw new Error(`Reserva incompleta. Faltan: ${missingFields.join(", ")}`);
    }

    //Chequeo simple de email 
     if (!/^\S+@\S+\.\S+$/.test(bookingData.clientEmail)) {
            throw new Error("El clientEmail no es válido.");
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

async addServiceToBooking(bid, serviceId) {
    const bookings = await this.#readFile();
    const booking = bookings.find((b) => b.id === Number(bid));

    if (!booking) return null;

    const item = booking.services.find((s) => s.service === serviceId);

    if (item) {
        item.quantity += 1;
    } else {
        booking.services.push({ service: serviceId, quantity: 1 });
    }

    await this.#saveFile(bookings);
    return booking;
}

}
