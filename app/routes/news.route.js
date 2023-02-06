const express = require('express');
const news = require('../controllers/news.controller');

const router = express.Router();

router.route("/")
    .get(news.findAll)
    .post(news.create)
    .delete(news.deleteAll);

router.route('/:id')
    .get(news.findOne)
    .put(news.update)
    .delete(news.delete);

module.exports = router;