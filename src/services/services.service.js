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

    async getServicesById(id)
    {
        const service = await servicesRepository.getById(id);

        if (!services) {
            throw createError("Servicio no encontrado.", "not_found");
        }
        return service;
    }

    async createService(serviceData)
    {
        const missingFields = REQUIRED_FIELDS.filter(
            (fields) => 
                serviceData?.[field] === undefined ||
                serviceData?.[field] === null ||
                serviceData?.[field] === ""
        );

        const invalidFields = getInvalidFields(cleanData);

        if (invalidFields.length > 0) {
            throw createError(
                `Campos inválidos: ${invalidFields.join(", ")}`,
                "validation"
            );
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