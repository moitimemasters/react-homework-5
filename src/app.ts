import express from "express";
import bodyParser from "body-parser";
import categoryRoutes from "./routers/category";
import productRoutes from "./routers/product";
import "reflect-metadata";

const app = express();

app.use(bodyParser.json());
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

export default app;
