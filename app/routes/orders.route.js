const express = require('express');
const orders = require('../controllers/orders.controller');

const router = express.Router();

router.route("/")
    .get(orders.findAll)
    .post(orders.create)
    .delete(orders.deleteAll);

router.route("/category/:type")
    .get(orders.findByCategory);

router.route('/favourite')
    .get(orders.findAllFavorite);

router.route('/:id')
    .get(orders.findOne)
    .put(orders.update)
    .delete(orders.delete);

module.exports = router;