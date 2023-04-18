const { verifySignUp } = require("../middleware/index");
const authController = require("../controllers/auth.controller");
const { isAdmin } = require('../middleware/authJwt')
const express = require('express');
const router = express.Router();
const { validateToken, verifyToken } = require('../middleware/authJwt')
router.route(
    "/signup"
).post([
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
    authController.signup
]);

router.route("/signin").post((req, res, next) => {
    res.set(
        "Access-Control-Allow-Headers",
        " Origin, Content-Type, Accept"
    );
    next();
}, authController.signin);

router.route("/check-token").get([verifyToken, validateToken]);

router.route("/signin-admin/").post((req, res, next) => {
    res.set(
        "Access-Control-Allow-Headers",
        " Origin, Content-Type, Accept"
    );
    next();
}, authController.signinAdmin);

module.exports = router;