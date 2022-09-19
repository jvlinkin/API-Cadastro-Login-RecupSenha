"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRoutes_1 = __importDefault(require("../modules/users/UserRoutes"));
const routes = (0, express_1.Router)();
//Rotas aqui
routes.use('/user', UserRoutes_1.default);
exports.default = routes;
