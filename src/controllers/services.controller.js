import servicesService from "../services/services.service.js";


//----------------------------------------------------------------
//Controller -> lee el req, llama al servicio y responde el res
//----------------------------------------------------------------

//Traduce el "type" del error del service al codigo HTTP

const STATUS_BY_TYPE = {
    validation: 400,
    not_found:404,
};

const handlerError = (res, error) => {
    const status = STATUS_BY_TYPE[error.type] || 500;  //si no tiene type, es un error inesperado
    res.status(status).json({error: error.message});
};

//GET /api/services
 export const getServices = async (req, res) => {
    try{
        const {category, available} = req.query;
        const services = await servicesService.getServices({category, available });
        res.status(200).json(services);
    }catch(error)
    {
        handlerError(res, error);
    }
 };

export const getServiceById = async (req, res) => {
    try{
        const service = await servicesService.getServiceById(req.params.sid);
        res.status(200).json(service);
    }catch(error)
    {
        handlerError(res, error);
    }
};

//POST /api/services
export const createService = async (req, res) => 
{
    try{
        const newService = await servicesService.createService(req.body);
        res.status(201).json(newService);
    }catch(error)
    {
        handlerError(res, error);
    }
};

//PUT /api/services
export const updateService = async(req, res) => {
    try{
        const updated = await servicesService.updateService(req.params.sid, req.body);
        res.status(200).json(updated);
    }catch(error)
    {
        handlerError(res, error);
    }
};

//DELETE /api/services
export const deleteService = async(req, res) => 
{
    try{
        const deleted = await servicesService.deleteService(req.params.sid);
        res.status(200).json({message: "Servicio eliminado.", service: deleted});
    }catch(error)
    {
        handlerError(res, error);
    }
};
