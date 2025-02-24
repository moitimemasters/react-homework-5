import express, { Request, Response, NextFunction, Router } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import categoryRoutes from "./routers/category";
import productRoutes from "./routers/product";
import "reflect-metadata";
import {
  ExceptionHandler,
  NotFoundError,
  ValidationError,
} from "./errors/errors";

const app = express();
const apiRouter = Router();

const exceptionHandler = new ExceptionHandler();
exceptionHandler.register(NotFoundError, NotFoundError.getHandler());
exceptionHandler.register(ValidationError, ValidationError.getHandler());

app.use(bodyParser.json());
app.use(morgan("short"));
apiRouter.use("/categories/", categoryRoutes);
apiRouter.use("/products/", productRoutes);
app.use("/api/", apiRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) =>
  exceptionHandler.withExcepionHandler(err, req, res, next),
);

export default app;
