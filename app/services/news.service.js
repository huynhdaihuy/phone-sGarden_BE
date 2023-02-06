const { ObjectId } = require('mongodb');

class NewsService {
    constructor(client) {
        this.News = client.db().collection('news');
    }
    extractNewsData(payload) {
        const news = {
            title: payload.title,
            content: payload.content,
            path: payload.path,
            dateAdded: new Date()
        };
        // Remove undefined fields
        Object.keys(news).forEach(
            (key) => news[key] === undefined && delete news[key]
        );
        return news;
    }
    async create(payload) {
        const news = this.extractNewsData(payload);
        const result = await this.News.findOneAndUpdate(
            news, { $set: {} }, { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.News.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id) {
        return await this.News.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
    }
    async update(id, payload) {

        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractNewsData(payload);
        const result = await this.News.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' });
        return result.value;
    }

    async delete(id) {
        const result = await this.News.findOneAndDelete({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
        return result.value;
    }
    async deleteAll() {
        const result = await this.News.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = NewsService;