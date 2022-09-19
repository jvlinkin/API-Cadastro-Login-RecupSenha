"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_jwt_1 = __importDefault(require("../config/auth_jwt"));
const jsonwebtoken_1 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({ message: 'JWT is missing.' });
    }
    const [, token] = authHeader.split(' ');
    const secret = auth_jwt_1.default.jwt.secret;
    try {
        (0, jsonwebtoken_1.verify)(token, secret, function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: 'JWT is invalid.' });
            }
            return next();
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
exports.default = isAuthenticated;
