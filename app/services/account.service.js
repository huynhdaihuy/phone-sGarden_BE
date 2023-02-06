const { ObjectId } = require('mongodb');


class AccountsService {
    constructor(client) {
        this.account = client.db().collection('users');
    }
    extractAccountData(payload) {
        const account = {
            username: payload.username,
            password: payload.password,
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
        };
        // Remove undefined fields
        Object.keys(account).forEach(
            (key) => account[key] === undefined && delete account[key]
        );
        return account;
    }
    async create(payload) {
        const account = this.extractAccountData(payload);
        const result = await this.account.findOneAndUpdate(
            account, { $set: { favorite: account.favorite === true } }, { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.account.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id) {
        return await this.account.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
    }
    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractAccountData(payload);
        const result = await this.account.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' });
        return result.value;
    }
    async delete(id) {
        const result = await this.account.findOneAndDelete({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
        return result.value;
    }
    async deleteAll() {
        const result = await this.account.deleteMany({});
        return result.deletedCount;
    }
    async login(filter) {
        const cursor = await this.account.findOne(filter);
        return cursor;
    }

}

module.exports = AccountsService;