import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

//----------------------------------------------------------
//DAO -> Lee y escribe y directamente en el archivo JSON
//----------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//El DAO conoce la ruta de su archivo
const FILE_PATH = path.join(__dirname, "..", "data", "bookings.json");

class BookingsDAO {
    //----Metodos auxiliares (privados) -----
    async #readFile()
    {
        try{
            const content = await fs.readFile(FILE_PATH, "utf-8");
            return JSON.parse(content);
        }catch(error)
        {
            //Si el archivo no existe todavia, arrancamos con una lista vacia
            if (error.code === "ENOENT") return [];
            throw error;
        }
    }

    async #saveFile(bookings) {
    await fs.writeFile(FILE_PATH, JSON.stringify(bookings, null, 2));
    }

    //---Metodos publicos---
    //Guarda una reserva nueva. El id se genera
    
    async create(data)
    {
        const bookings = await this.#readFile();
        const lastId = bookings.reduce((max, b) => Math.max(max, b.id), 0);

        const newBooking = {...data, id: lastId + 1 };

        bookings.push(newBooking);
        await this.#saveFile(bookings);
        return newBooking;
    }

    //Devuelve la reserva o null si no existe
    async getById(id)
    {
        const bookings = await this.#readFile();
        return bookings.find((b) => b.id === Number(id)) || null;
    }

    //Actualiza una reserva.Devuelve la actualizada o null si no existe
    async update(id, data)
    {
        const bookings = await this.#readFile();
        const index = bookings.findIndex((b) => b,id === Number(id));
        
        if (index === -1) return null;

        //El id original va al final para que no pueda pisar
        bookings[index] = { ...bookings[index], ...data, id: bookings[index].id};
        await this.#saveFile(bookings);
        return bookings[index];
    }
}

export default new BookingsDAO();