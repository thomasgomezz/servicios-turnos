import fs from "fs/promises";

//Campos que son obligatorios al crear un servicio
const REQUIRED_FIELDS = [
    "name",
    "description",
    "duration",
    "price",
    "category",
    "available",
];

export default class ServiceManager {
    //recibe la ruta del archivo JSON donde se guardan los servicios
    constructor(filePath) {
        this.filePath = filePath;
    }

    //-------Metodos auxiliares # -> los hace privados, solo se pueden usar dentro de la clase (leer y guaradr el archivo)-----

    async #readFile() {     //leer archivo 
        try {

            //fs.readFile leo el texto "utf-8" y con el await espero a que termine
            const content = await fs.readFile(this.filePath, "utf-8");
            return JSON.parse(content);     //convierte el texto en una lista de objetos de java con los q se puede trabajar
        }
        catch(error)
        {
            //Si el archivo no existe todavia(falla), arrancamos con una lista vacia
            if (error.code === "ENOENT") return[];
            throw error;
        }
    }

    async #saveFile(services)       //Guardar archivo
    {
        await fs.writeFile(this.filePath, JSON.stringify(services, null, 2));   //stringify convierte la lista a texto JSON, null,2 lo deja ordenado, con sangria de 2 espacios. writeFile lo escribe en el archivo. 
    }

    //--------Metodos publicos-------

    //Lee el archivo y devuelve todos los servicios.
    async getServices()
    {
        return await this.#readFile();
    }

    //Devuelve un servicio por id, o null si no existe
    async getServiceById(id)
    {
        const services = await this.#readFile();
        const service = services.find((s) => s.id === Number(id));  //Find -> recorre la lista y devuelve el primer elemento q cumple la condicion.
        return service || null; 
    }

    //Agrega un servicio nuevo. EL id se genera acá adentro
    async addService(serviceData)
    {
        //Validamos que esten todos los campos
        //(available) puede ser false, por eso comparamos con un undefined/null

        //MissingFields = campos faltantes
        //field = campos 

        const missingFields = REQUIRED_FIELDS.filter(        
            (field) => 
                serviceData?.[field] === undefined ||
                serviceData?.[field] === null ||
                serviceData?.[field] ===  ""
        );

        if (missingFields.length > 0) {
            throw new Error (`Servicio incompleto. Faltan: ${missingFields.join(", ")}`);
        }
        
        const services = await this.#readFile();

        //Id nuevo = el id mas grande quue existe + 1 (o 1 si la lista está vacía)
        const lastId = services.reduce((max, s) => Math.max(max, s.id) , 0);    //reduce -> recorre la listta acumulando resultados, arranca en 0.

        //Armamos el servicio con solo los campos permitidos
        //(Asi ignoramos un id que venga de afuera)

        const newService = 
        {
            id: lastId + 1,
            name: serviceData.name,
            description: serviceData.description,
            duration: serviceData.duration,
            price: serviceData.price,
            category: serviceData.category,
            available: serviceData.available, 
        };

        //Guardamos. 
        services.push(newService);
        await this.#saveFile(services);
        return newService;
    }

    //Actualizamos un servicio. No deja cambiar el id. Devuelve null si no existe.
    //updatedData -> datos actualizados

    async updateService(id, updatedData)    
    {
        const services = await this.#readFile();
        const index = services.findIndex((s) => s.id === Number(id));
    
        if (index === -1) return null;

        //Mezclamos los datos viejos con los nuevos y volvemos a poner el id original al final para q no se pueda pisar

        services[index] = {
            ...services[index],
            ...updatedData,
            id: services[index].id,
        };

        await this.#saveFile(services);
        return services[index];
    }

    //Elimina un servicio. Devuelve el servicio eliminado o null si no existe.
    async deleteService(id)
    {
        const services = await this.#readFile();
        const index = services.findIndex((s) => s.id === Number(id));

        if (index === -1) return null;

        const [deletedService] = services.splice(index, 1); //splice -> borra un elemento a partir de esa posicion y devuelve una lista con lo borrado.
        await this.#saveFile(services);
        return deletedService;
    }
}