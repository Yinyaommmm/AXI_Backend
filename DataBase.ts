import mongoose, { Schema } from "mongoose";

export class Mongo {
  constructor(
    private dbName = "axi_backend",
    private url: string = `mongodb://localhost:27017/axi_backend${dbName}`
  ) {}
  public async Connect() {
    await mongoose.connect(this.url);
    console.log(`Connect to the ${this.dbName} database`);
  }
}
