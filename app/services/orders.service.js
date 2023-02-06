const { ObjectId } = require('mongodb');

class OrdersService {
    constructor(client) {
        this.orders = client.db().collection('orders');
    }
    extractOrdersData(payload) {
        const orders = {
            method: payload.method,
            totalPrice: payload.totalPrice,
            cart: payload.cart,
            note: payload.note ? payload.note : 'Không có',
            infoUser: payload.infoUser,
            quantity: payload.quantity,
            status: payload.status,
            dateAdded: new Date()
        };
        // Remove undefined fields
        Object.keys(orders).forEach(
            (key) => orders[key] === undefined && delete orders[key]
        );
        return orders;
    }
    async create(payload) {
        const orders = this.extractOrdersData(payload);
        const result = await this.orders.findOneAndUpdate(
            orders, { $set: { favorite: orders.favorite === true } }, { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.orders.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id) {
        return await this.orders.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
    }
    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractOrdersData(payload);
        const result = await this.orders.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' });
        return result.value;
    }

    async delete(id) {
        const result = await this.orders.findOneAndDelete({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
        return result.value;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }
    async deleteAll() {
        const result = await this.orders.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = OrdersService;