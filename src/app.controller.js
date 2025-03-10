import {connectDB} from "./DB/dbConnection.js";
import {globalErrorHandling} from "./Utilis/error/error.js";
import authController from "./Modules/Auth/auth.controller.js";
import videoController from "./Modules/video/video.controller.js";
import cors from "cors";

const bootstrap = (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/Auth", authController);
  app.use("/Video", videoController);
  app.all("*", (res) => {
    return res.status(404).json({message: "invalid routing"});
  });
  app.use(globalErrorHandling);
  connectDB();
};

export default bootstrap;
