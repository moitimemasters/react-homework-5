import "reflect-metadata";
import { inject, singleton } from "tsyringe";
import { Repository } from "../repositories/repository";
import { Category, validateCategory } from "../models/category";
import { Request, Response } from "express";
import {
  ExceptionHandler,
  NotFoundError,
  ValidationError,
} from "../errors/errors";
import { UpdateProduct, validateProduct } from "../models/product";
import { TupleType } from "typescript";

@singleton()
export class Service {
  private exceptionHandler: ExceptionHandler = new ExceptionHandler();
  constructor(@inject(Repository) private repository: Repository) {
    this.exceptionHandler.register(
      Error,
      (_: Request, res: Response, e: Error) => {
        res
          .status(500)
          .send({ error: e.name, context: { message: e.message } });
      },
    );
    this.exceptionHandler.register(
      ValidationError,
      ValidationError.getHandler(),
    );
    this.exceptionHandler.register(NotFoundError, NotFoundError.getHandler());
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const categories = await this.repository.getCategories();
      res.send({ categories: categories });
    });
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const category = validateCategory(req.body);
      const insertedId = await this.repository.insertCategory(category);
      res.send({ id: insertedId });
    });
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const id = req.params["id"];
      const category = await this.repository.getCategory(id);
      if (category == null) {
        throw new NotFoundError("Not found error", {
          detail: `Category with id=${id} is not found.`,
        });
      }
      res.send({ category });
    });
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const id = req.params.id;
      const name = req.body.name;
      if (!(typeof name === "string")) {
        throw new ValidationError("Validation Error", {
          violations: [
            "No string value for field `name` is present in payload",
          ],
        });
      }
      const updated = await this.repository.updateCategory(id, name);
      if (!updated) {
        throw new NotFoundError("Not found error", {
          detail: `Category with id=${id} is not found and therefore was not updated.`,
        });
      }
      res.send({ updated });
    });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const id = req.params.id;
      const deleted = await this.repository.deleteCategory(id);
      if (!deleted) {
        throw new NotFoundError("Not found error", {
          detail: `Category with id=${id} is not found and therefore was not deleted.`,
        });
      }
      res.send({ deleted });
    });
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      let limit = (req.query.limit && Number(req.query.limit)) || null;
      let offset = (req.query.offset && Number(req.query.offset)) || null;
      const products = await this.repository.getProducts(limit, offset);
      res.send({ products });
    });
  }

  async addProduct(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const body = validateProduct(req.body);
      const id = await this.repository.insertProduct(body);
      res.send({ id });
    });
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const id = req.params.id;
      const body = req.body;
      let updates: UpdateProduct = {};

      const fields: Array<[keyof UpdateProduct, string]> = [
        ["name", "string"],
        ["description", "string"],
        ["categoryId", "string"],
        ["quantity", "number"],
        ["price", "number"],
      ];

      for (let i in fields) {
        let [field, type] = fields[i];
        if (field in body && typeof body[field] === type) {
          updates[field] = body[field];
        }
      }

      let updated = await this.repository.updateProduct(id, updates);
      if (!updated) {
        throw new NotFoundError("Not found error", {
          detail: `Product with id=${id} is not found and therefore was not updated.`,
        });
      }
      res.send({ updated });
    });
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const id = req.params.id;

      let deleted = await this.repository.deleteProduct(id);
      if (!deleted) {
        throw new NotFoundError("Not found error", {
          detail: `Product with id=${id} is not found and therefore was not deleted.`,
        });
      }
      res.send({ deleted });
    });
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    await this.exceptionHandler.withExcepionHandler(req, res, async () => {
      const id = req.params.id;

      let product = await this.repository.getProduct(id);
      if (!product) {
        throw new NotFoundError("Not found error", {
          detail: `Product with id=${id} was not found.`,
        });
      }
      res.send({ product });
    });
  }
}
