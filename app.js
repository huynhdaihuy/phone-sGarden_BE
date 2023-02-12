const express = require("express");
const cors = require("cors");

const ApiError = require('./app/api-error');
const app = express();
const productRouter = require('./app/routes/product.route');
const newsRouter = require('./app/routes/news.route');
const authRouter = require('./app/routes/auth.routes');
const userRouter = require('./app/routes/user.routes');
const cartRouter = require('./app/routes/cart.route');





var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());



app.use('/api/test', (req, res, next) => {
    res.set(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
}, userRouter);
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