import servicesDao from "../dao/services.dao.js";

//Repository -> ofrece métodos de acceso a datos sin reglas de negocios

class ServicesRepository{
    async getAll()
    {
        return await servicesDao.getAll();
    }

    async getById(id)
    {
        return await servicesDao.getById(id);
    }

    async create(data)
    {
        return await servicesDao.create(data);
    }

    async update(id, data)
    {
        return await servicesDao.update(id, data);
    }

    async delete(id)
    {
        return await servicesDao.delete(id);
    }

}

export default new ServicesRepository();