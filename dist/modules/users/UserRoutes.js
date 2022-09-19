"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("./controller/UserController");
const celebrate_1 = require("celebrate");
const isAuthenticated_1 = __importDefault(require("../../middlewares/isAuthenticated"));
const usersRouter = (0, express_1.Router)();
const userController = new UserController_1.UserController();
usersRouter.post('/register', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        first_name: celebrate_1.Joi.string().required(),
        last_name: celebrate_1.Joi.string().required(),
        age: celebrate_1.Joi.number().required(),
        address: celebrate_1.Joi.string().required(),
        number: celebrate_1.Joi.string().required(),
        zip_code: celebrate_1.Joi.string().required(),
        city: celebrate_1.Joi.string().required(),
        cellphone: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required()
    }
}), userController.create);
usersRouter.post('/login', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required()
    }
}), userController.login);
usersRouter.get('/users', isAuthenticated_1.default, userController.showUsers);
usersRouter.post('/forgot-password', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        email: celebrate_1.Joi.string().email().required(),
    }
}), userController.forgotPassword);
usersRouter.post('/reset-password', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        email: celebrate_1.Joi.string().email().required(),
        token: celebrate_1.Joi.string().hex().required(),
        password: celebrate_1.Joi.string().required()
    }
}), userController.resetPassword);
exports.default = usersRouter;
