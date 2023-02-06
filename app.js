const express = require("express");
const cors = require("cors");

const ApiError = require('./app/api-error');
const app = express();
const productRouter = require('./app/routes/product.route');
const accountRouter = require('./app/routes/account.route');
const ordersRouter = require('./app/routes/orders.route');
const newsRouter = require('./app/routes/news.route');


const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());


app.use('/api/products', productRouter);
app.use('/api/users', accountRouter);
app.use('/api/orders', ordersRouter);
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