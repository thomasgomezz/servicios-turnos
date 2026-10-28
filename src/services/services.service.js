import servicesRepository from "../repositories/services.repository.js";

//service -> Contiene reglas de negocio, no conoce req/res

//Campos q son obligatorios al crear un servicio

const REQUIRED_FIELDS = [
    "name",
    "description",
    "duration",
    "price",
    "category",
    "available",
];

//Una regla por campo
const FIELD_RULES = {
    name: (v) => typeof v === "string" && v.trim() !== "",
    description: (v) => typeof v === "string" && v.trim() !== "",
    duration: (v) => typeof v === "number" && v > 0,
    price : (v) => typeof v === "number" && v >= 0,
    category : (v) => typeof v === "string" && v.trim() !== "",
    available : (v) => typeof v === "boolean",
};

//Devuelve los campos q vinieron pero no cumplen con su regla
function getInvalidFields(data)
{
    return Object.keys(FIELD_RULES).filter(
        (field) => data[field] !== undefined && !FIELD_RULES[field](data[field])
    );
}

//Crea un error con un  "type": el service dice QUE paso
function createError(message, type)
{
    const error = new Error(message);
    error.type = type;
    return error;
}

class ServicesService {
    //Devuelve los servicios. Acepta filtros opcionales {category, available}

    async getServices(filters = {})
    {
        const {category, available } = filters; 
        let services = await servicesRepository.getAll();

        if (category) {
            services = services.filter(
            (s) => s.category.toLowerCase() === category.toLowerCase()
            );
        }

        //en la URL todo llega como texto
        if (available !== undefined) {
            services = services.filter((s) => String(s.available) === available);
        }
        return services;
    }

    async getServiceById(id)
    {
        const service = await servicesRepository.getById(id);

        if (!service) {
            throw createError("Servicio no encontrado.", "not_found");
        }
        return service;
    }

    async createService(serviceData)
    {
        //1- campos faltantes
        const missingFields = REQUIRED_FIELDS.filter(
            (field) => 
                serviceData?.[field] === undefined ||
                serviceData?.[field] === null ||
                serviceData?.[field] === ""
        );

        if (missingFields.length > 0) {
            throw createError(`Servicio incompleto. Faltan: ${missingFields.join(", ")}`,
                "validation");
        }

        //2-Tipos inválidos
        const invalidFields = getInvalidFields(serviceData);

        if (invalidFields.length > 0) {
            throw createError(
                `Campos inválidos: ${invalidFields.join(", ")}`,
                "validation"
            );
        }

        //3-Armamos el servicio con los campos permitidos(se ignora el id q venga afuera)
        const newService = {
            name: serviceData.name,
            description: serviceData.description,
            duration: serviceData.duration,
            price: serviceData.price,
            category: serviceData.category,
            available: serviceData.available,
        };

        return await servicesRepository.create(newService);
    }

    async updateService(id, updateData) {
        //Nos quedamos solo con los campos conocidos
        const cleanData = {};
        for(const field of Object.keys(FIELD_RULES)){
            if (updateData?.[field] !== undefined) {
                cleanData[field] = updateData[field];
            }
        }
        const invalidFields = getInvalidFields(cleanData);
        if (invalidFields.length > 0) {
            throw createError (`Campos inválidos: ${invalidFields.join(", ")}`,
                "validation");
        }
        const updated = await servicesRepository.update(id, cleanData);

        if (!updated) {
            throw createError ("Servicio no encontrado.", "not_found");
        }

        return updated;
    }

    async deleteService(id)
    {
        const deleted = await servicesRepository.delete(id);

        if (!deleted) {
            throw createError("Servicio no encontrado.", "not_found")
        }
        return deleted;
    }
}

export default new ServicesService();