import { Router } from "express";
import usersRouter from "../modules/users/UserRoutes";

const routes = Router();

//Rotas aqui
routes.use("/user", usersRouter);

export default routes;
