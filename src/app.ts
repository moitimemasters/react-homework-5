import express, { Router } from "express";
import bodyParser from "body-parser";
import categoryRoutes from "./routers/category";
import productRoutes from "./routers/product";
import "reflect-metadata";

const app = express();
const apiRouter = Router();

app.use(bodyParser.json());
apiRouter.use("/categories/", categoryRoutes);
apiRouter.use("/products/", productRoutes);
app.use("/api/", apiRouter);

export default app;
