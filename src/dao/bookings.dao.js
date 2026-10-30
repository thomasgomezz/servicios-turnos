import mongoose from "mongoose";
import {bookingModel} from "../models/booking.model.js";
//----------------------------------------------------------
//DAO -> Lee y escribe y directamente en el archivo JSON
//----------------------------------------------------------

class BookingsDAO {
    //---Metodos publicos---
    //Guarda una reserva nueva. El id se genera
    
    async create(data)
    {
        return await bookingModel.create(data);
    }

    //Devuelve la reserva o null si no existe
    async getById(id)
    {
        if (!mongoose.isValidObjectId(id)) return null;   //id con formato invalido = no existe (404)
        return await bookingModel.findById(id);
    }

    //Actualiza una reserva.Devuelve la actualizada o null si no existe
    async update(id, data)
    {
         if (!mongoose.isValidObjectId(id)) return null;
        return await bookingModel.findByIdAndUpdate(id, data, { new: true });
    }
}

export default new BookingsDAO();