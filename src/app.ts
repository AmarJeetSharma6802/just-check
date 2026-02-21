import express from "express";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.ts";
import userRouter from "./router/router.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/api", userRouter);

export default app;
