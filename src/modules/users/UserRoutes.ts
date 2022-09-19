import { Router } from "express";
import { UserController } from "./controller/UserController";
import {Joi, celebrate, Segments, CelebrateError} from 'celebrate';
import isAuthenticated from "../../middlewares/isAuthenticated";



const usersRouter = Router();
const userController = new UserController();

usersRouter.post('/register',celebrate({
    [Segments.BODY]:{
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        age: Joi.number().required(),
        address: Joi.string().required(),
        number: Joi.string().required(),
        zip_code: Joi.string().required(),
        city: Joi.string().required(),
        cellphone: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
}) ,userController.create)

usersRouter.post('/login',celebrate({
    [Segments.BODY]:{
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
}) ,userController.login)

usersRouter.get('/users', isAuthenticated ,userController.showUsers);

usersRouter.post('/forgot-password',celebrate({
    [Segments.BODY]:{
        email: Joi.string().email().required(),
    }
}) ,userController.forgotPassword)

usersRouter.post('/reset-password',celebrate({
    [Segments.BODY]:{
        email: Joi.string().email().required(),
        token: Joi.string().hex().required(),
        password: Joi.string().required()
    }
}) ,userController.resetPassword)





export default usersRouter;