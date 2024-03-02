import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Mongo } from "./DataBase";

class Server {
  constructor(
    private port: number = 3000,
    private app = express(),
    private mg: Mongo = new Mongo()
  ) {}

  async Start() {
    this.setMiddleWare();
    this.setRouter();
    await this.mg.Connect();
    this.app.listen(this.port, () => {
      console.log(`Express server running on ${this.port}`);
    });
  }

  private setMiddleWare(): void {
    // req的请求体放在req.body上并作了限制
    this.app.use(bodyParser.json({ limit: "10mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
    // 允许跨域
    this.app.use(cors());
  }

  private setRouter(): void {
    const router = express.Router();
    router.get("/", (req, res) => {
      res.json({
        a: 1,
        b: 2,
      });
    });

    this.app.use(router);
  }
}

new Server().Start();
