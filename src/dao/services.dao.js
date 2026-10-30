import {serviceModel} from "../models/service.model.js";
import mongoose from "mongoose";


//DAO -> habla directo con la base de datos, sin reglas de negocios
class ServicesDAO {
    async getAll()
    {
        return await serviceModel.find().lean();    //lean -> devuelve los objetos simples en vez de doc de mongoose
    }

    //Devuelve el servicio o null si no existe
    async getById(id)
    {
        if (!mongoose.isValidObjectId(id)) return null;   //id con formato invalido = no existe (404)
        return await serviceModel.findById(id);
    }
    
    //Guarda un servicio nuevo
    async create(data)
    {
        return await serviceModel.create(data);
    }


    //Actualizar un servicio. Devuelve el actualizado o null si no existe
    async update(id, data)
    {
        if (!mongoose.isValidObjectId(id)) return null;
        return await serviceModel.findByIdAndUpdate(id, data, { new: true });   //new: true -> devuelve el documento ya actualizado
    }

    //Elimina un servicio
    async delete(id)
    {
        if (!mongoose.isValidObjectId(id)) return null;
        return await serviceModel.findByIdAndDelete(id);
    }
}
//Exportamos una instancia lista para usar
export default new ServicesDAO();