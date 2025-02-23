import "reflect-metadata";
import { inject, singleton } from "tsyringe";
import { Category } from "../models/category";
import { Collection, ObjectId } from "mongodb";
import { MongoWrapper } from "../lifespan";
import { Product, UpdateProduct } from "../models/product";

@singleton()
export class Repository {
  private categoryCollection: Collection<Category>;
  private productCollection: Collection<Product>;

  constructor(@inject(MongoWrapper) private mongoWrapper: MongoWrapper) {
    const db = this.mongoWrapper.getMongoClient().db("warehouse-app");
    this.categoryCollection = db.collection("category");
    this.productCollection = db.collection("product");
  }

  private makeIdFilter(id: string): { _id: ObjectId } {
    return { _id: new ObjectId(id) };
  }

  async getCategories(): Promise<Array<Category>> {
    return await this.categoryCollection.find().toArray();
  }

  async getCategory(id: string): Promise<Category | null> {
    return await this.categoryCollection.findOne(this.makeIdFilter(id));
  }

  async updateCategory(id: string, name: string): Promise<Boolean> {
    return (
      (
        await this.categoryCollection.updateOne(this.makeIdFilter(id), {
          $set: { name },
        })
      ).matchedCount > 0
    );
  }

  async insertCategory(category: Category): Promise<string> {
    return (
      await this.categoryCollection.insertOne(category)
    ).insertedId.toHexString();
  }

  async deleteCategory(id: string): Promise<Boolean> {
    return (
      (await this.categoryCollection.deleteOne(this.makeIdFilter(id)))
        .deletedCount > 0
    );
  }

  async getProducts(
    limit: number | null | undefined,
    offset: number | null | undefined,
  ): Promise<Array<Product>> {
    let findExpression = this.productCollection.find({});
    if (typeof offset === "number" && offset >= 0) {
      findExpression = findExpression.skip(offset);
    }
    if (typeof limit === "number" && limit > 0) {
      findExpression = findExpression.limit(limit);
    }
    return await findExpression.toArray();
  }

  async insertProduct(product: Product): Promise<string> {
    return (
      await this.productCollection.insertOne(product)
    ).insertedId.toHexString();
  }

  async updateProduct(id: string, updates: UpdateProduct): Promise<Boolean> {
    let updateFilter = { $set: updates };
    return (
      (
        await this.productCollection.updateOne(
          this.makeIdFilter(id),
          updateFilter,
        )
      ).matchedCount > 0
    );
  }

  async getProduct(id: string): Promise<Product | null> {
    return await this.productCollection.findOne(this.makeIdFilter(id));
  }

  async deleteProduct(id: string): Promise<Boolean> {
    return (
      (await this.productCollection.deleteOne(this.makeIdFilter(id)))
        .deletedCount > 0
    );
  }
}
