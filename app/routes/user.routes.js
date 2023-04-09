const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const express = require('express');
const router = express.Router();

router.get("/", controller.getAllUser);

router.route('/avatar/:id')
    .put(controller.uploadAvatar)

router.route('/forgot-password/')
    .post(controller.forgotPassword)

router.put('/:id/password', controller.changePassword);

router.route('/:id')
    .get(controller.findOne)
    .put(controller.update)
    .delete(controller.delete);

router.get("/all", controller.allAccess);

router.get("/user", [authJwt.verifyToken], controller.userBoard);


router.get(
    "/admin", [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
);


module.exports = router;