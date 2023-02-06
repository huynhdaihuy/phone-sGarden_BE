const { ObjectId } = require('mongodb');

class ProductService {
    constructor(client) {
        this.Product = client.db().collection('product');
    }
    extractProductData(payload) {
        const product = {
            name: payload.name,
            prices: payload.price,
            brand: payload.brand,
            madeIn: payload.madeIn,
            colors: payload.colors,
            desc: payload.desc,
            pathImages: payload.pathImages,
            type: payload.type,
            screen: payload.screen,
            cpu: payload.cpu,
            ram: payload.ram,
            rom: payload.rom,
            os: payload.os,
            sim: payload.sim,
            charger: payload.charger,
            camFront: payload.camFront,
            camRear: payload.camRear,
            series: payload.series,
            maxCharging: payload.maxCharging,
            jackConnect: payload.jackConnect,
            output: payload.output,
            tech: payload.tech,
            cableLength: payload.cableLength,
            capacity: payload.capacity,
        };
        // Remove undefined fields
        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }
    async create(payload) {
        const product = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            product, {
                $setOnInsert: {
                    createdAt: new Date()
                }
            }, { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();
    }
    async findByKeyword(keyword) {
        const str = '/$' + keyword + '$/'
        return await this.find({
            $or: [{
                    name: { $regex: keyword, $options: 'i' }
                },
                {
                    desc: { $regex: keyword, $options: 'i' }
                },
            ]
        });
    }
    async findByPriceAbove(price) {
        return await this.find({
            prices: {
                $elemMatch: { $gte: Number(price) }
            }
        });
    }
    async findByPriceBelow(price) {
        return await this.find({
            prices: {
                $elemMatch: { $lt: Number(price) }
            }
        });
    }
    async findByPriceLimit(price) {
        return await this.find({
            prices: {
                $elemMatch: { $gte: Number(price.priceAbove), $lt: Number(price.priceBelow) }
            }
        });
    }

    async findByPriceAboveType(price, type) {
        return await this.find({
            $and: [{
                    prices: {
                        $elemMatch: { $gte: Number(price) }
                    }
                },
                {
                    type: { $regex: type, $options: 'i' },
                }
            ]
        });
    }
    async findByPriceBelowType(price, type) {
        return await this.find({
            $and: [{
                    prices: {
                        $elemMatch: { $lt: Number(price) }
                    }
                },
                {
                    type: { $regex: type, $options: 'i' },
                }
            ]
        });
    }
    async findById(id) {
        return await this.Product.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
    }
    async findByBrandRam(cond) {
        const ram = Number(cond.ram);
        return await this.find({
            $and: [{
                    brand: { $regex: cond.brand, $options: 'i' }
                },
                {
                    ram: { $eq: ram }
                },
            ]
        });
    }
    async findByBrandRamOs(cond) {
        const ram = Number(cond.ram);
        return await this.find({
            $and: [{
                    brand: { $regex: cond.brand, $options: 'i' }
                },
                {
                    ram: { $eq: ram }
                },
                {
                    os: { $regex: cond.os, $options: 'i' }
                }

            ]
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' });
        return result.value;
    }

    async delete(id) {
        const result = await this.Product.findOneAndDelete({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
        return result.value;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }
    async deleteAll() {
        const result = await this.Product.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = ProductService;