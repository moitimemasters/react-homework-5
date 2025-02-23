import "reflect-metadata";
import express, { Router, Request, Response } from "express";
import { container } from "tsyringe";
import { Service } from "../services/service";

const router: Router = express.Router();
const service: Service = container.resolve(Service);

router.get("/", async (req: Request, res: Response) => {
  await service.getCategories(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
  await service.getCategory(req, res);
});

router.post("/", async (req: Request, res: Response) => {
  await service.addCategory(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await service.deleteCategory(req, res);
});

router.put("/:id", async (req: Request, res: Response) => {
  await service.updateCategory(req, res);
});

export default router;
