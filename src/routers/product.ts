import "reflect-metadata";
import express, { Router, Request, Response } from "express";
import { container } from "tsyringe";
import { Service } from "../services/service";
import { handleErrorAsync } from "../lifespan";

const router: Router = express.Router();
const service: Service = container.resolve(Service);

router.get(
  "/",
  handleErrorAsync(async (req: Request, res: Response) => {
    await service.getProducts(req, res);
  }),
);

router.get(
  "/:id",
  handleErrorAsync(async (req: Request, res: Response) => {
    await service.getProduct(req, res);
  }),
);

router.post(
  "/",
  handleErrorAsync(async (req: Request, res: Response) => {
    await service.addProduct(req, res);
  }),
);

router.put(
  "/:id",
  handleErrorAsync(async (req: Request, res: Response) => {
    await service.updateProduct(req, res);
  }),
);

router.delete(
  "/:id",
  handleErrorAsync(async (req: Request, res: Response) => {
    await service.deleteProduct(req, res);
  }),
);

export default router;
