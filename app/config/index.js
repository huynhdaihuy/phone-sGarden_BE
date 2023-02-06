const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        uri: 'mongodb://127.0.0.1:27017/bikeshop' || 'mongodb+srv://huynhdaihuybikeshop:123456789Aa@cluster0.j7uou1m.mongodb.net/bikeshop',
    },
};

module.exports = config