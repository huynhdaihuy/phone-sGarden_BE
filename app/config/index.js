const config = {
    app: {
        port: process.env.PORT || 8080,
    },
    db: {
        uri: 'mongodb://127.0.0.1:27017/bikeshop' || 'mongodb+srv://huynhdaihuybikeshop:123456789Aa@cluster0.j7uou1m.mongodb.net/bikeshop',
    },
    secretKey: "onodamichi-secret-key",
    jwt: {
        refreshExpiresIn: 86400,
        accessExpiresIn: 10800,
        refreshSecret: 'Blackism coder'
    }

};

module.exports = config