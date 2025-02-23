import { MongoClient } from "mongodb";
import { log } from "node:console";
import { singleton } from "tsyringe";

@singleton()
export class MongoWrapper {
  private mongoClient: MongoClient;

  constructor() {
    this.mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");
    this.mongoClient
      .connect()
      .then(() => {
        log("success");
      })
      .catch(() => {
        throw "Error connecting to DB";
      });
  }

  getMongoClient(): MongoClient {
    return this.mongoClient;
  }

  async closeMongoClient() {
    await this.mongoClient.close();
  }
}
