import * as dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express from "express";
import routes from "./routes";
import mongoose from "mongoose";
import { errors } from "celebrate";
import { errorMiddleware } from "../middlewares/error";
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(routes);
app.use(errors());

routes.get("/", async (req, res) => {
  return res.json({ message: "API IS WORKING." });
});

//middleware de tratamento de erro
app.use(errorMiddleware);

app.listen(PORT, async () => {
  const db_connection = process.env.MONGO_CONNECTION as string;
  await mongoose
    .connect(db_connection)
    .then(() => {
      console.log("Mongo is connected!");
    })
    .catch((err) => {
      console.log(
        "Ocorreu o seguinte erro ao tentar se conectar com o MongoDB:",
        err
      );
    });
  console.log(`Server is running on port ${PORT}.`);
});
