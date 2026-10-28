import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//El DAO conoce la ruta de su archivo
const FILE_PATH = path.join(__dirname, "..", "data", "services.json");

class ServicesDAO {
    //---Metodos auxiliares--- (privados)
     
    async #readFile(){
        try{
            const content = await fs.readFile(FILE_PATH, "utf-8");
            return JSON.parse(content);
        }
        catch(error)
        {
            //Si el archivo no existe todavia...
            if(error.code === "ENOENT") return [];
            throw error;
        }
    }

    async #saveFile(services)
    {
            await fs.writeFile(FILE_PATH, JSON.stringify(services, null, 2));
    }

    async getAll()
    {
        return await this.#readFile();
    }

    //Devuelve el servicio o null si no existe
    async getById(id)
    {
        const services = await this.#readFile();
        return services.find((s) => s.id === Number(id)) || null;

    }
    
    //Guarda un servicio nuevo
    async create(data)
    {
        const services = await this.#readFile();
        const lastId = services.reduce((max, s) => Math.max(max, s.id), 0);

        //El id va al final 
        const newService = { ...data, id: lastId + 1 };

        services.push(newService);
        await this.#saveFile(services);
        return newService;

    }


    //Actualizar un servicio. Devuelve el actualizado o null si no existe
    async update(id, data)
    {
        const services = await this.#readFile();
        const index = services.findIndex((s) => s.id === Number(id));

        if (index === -1) return null;

        services[index] = {...services[index], ...data, id: services[index].id};
        await this.#saveFile(services);
        return services[index];
    }

    //Elimina un servicio
    async delete(id)
    {
        const services = await this.#readFile();
        const index = services.findIndex((s) => s.id === Number(id));
        
        if (index === -1) return null;

        const [deletedService] = services.splice(index, 1);
        await this.#saveFile(services);
        return deletedService;
    }
}

//Exportamos una instancia lista para usar
export default new ServicesDAO();