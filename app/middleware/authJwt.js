const jwt = require("jsonwebtoken");
const config = require("../config/index");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    console.log("🚀 ~ file: authJwt.js:9 ~ token:", token)
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find({
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Admin Role!" });
                return;
            }
        );
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find({
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Moderator Role!" });
                return;
            }
        );
    });
};

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, roles: user.roles }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, roles: user.roles }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });
};

const refreshToken = async(req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return next(new ApiError(400, 'Refresh token is required!'));
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (err) {
        return next(new ApiError(401, 'Invalid refresh token!'));
    }

    const user = await User.findById(decoded.id).populate('roles');
    if (!user) {
        return next(new ApiError(404, 'User not found!'));
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({
        accessToken: accessToken,
        refreshToken: newRefreshToken,
        expiresIn: config.jwt.expiresIn,
        roles: user.roles.map(role => role.name),
    });
};

const validateToken = async(req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        console.log("🚀 ~ file: authJwt.js:130 ~ validateToken ~ token:", token)
        const decoded = await jwt.verify(token, config.secretKey);
        console.log("🚀 ~ file: authJwt.js:132 ~ validateToken ~ decoded:", decoded)
        res.status(200).json({ message: 'Token is valid', data: { id_user: decoded.id } });
    } catch (error) {
        next(error);
    }
};
const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    refreshToken,
    validateToken
};
module.exports = authJwt;