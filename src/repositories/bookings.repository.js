import bookingsDao from "../dao/bookings.dao.js";

//----------------------------------------
//Repository -> ofrece metodos de acceso a datos sin reglas de negocio

class BookingsRepository {
    async create(data)
    {
        return await bookingsDao.create(data);
    }

    async getById(id)
    {
        return await bookingsDao.getById(id);
    }

    async update(id, data)
    {
        return await bookingsDao.update(id, data);
    }
}

export default new BookingsRepository();