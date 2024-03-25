import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import config from "config";
import dbConnect, { client, connect } from "../utils/connect";

const app = express();
app.use(fileUpload());
app.use(cors({ origin: "*" }));

const server = require("http").createServer(app);

//data from config
const port = config.get<number>("port");
const host = config.get<string>("host");
dbConnect();

client.on("connect", connect);
client.on("message", async (topic, message) => {
  let data = topic.split("/"); // data spliting from mqtt
  console.log(data);
});
//headcheck route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("ok");
});

// error handling and response
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 409;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
});

server.listen(port, () =>
  console.log(`server is running in  http://${host}:${port}`)
);
