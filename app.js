const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser')
require('dotenv').config()

const ApiError = require('./app/api-error');
const app = express();
const productRouter = require('./app/routes/product.route');
const newsRouter = require('./app/routes/news.route');
const authRouter = require('./app/routes/auth.routes');
const userRouter = require('./app/routes/user.routes');
const cartRouter = require('./app/routes/cart.route');
const uploadRouter = require('./app/routes/upload.route');


const fileUpload = require('express-fileupload');





var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
const dotenv = require("dotenv");
const { urlencoded } = require("body-parser");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    fileUpload({
        limits: { fileSize: 1024 * 1024 * 1024 },
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.use('/api/test', (req, res, next) => {
    res.set(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
}, userRouter);

app.use('/api/upload', uploadRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/news', newsRouter);



app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});
module.exports = app;