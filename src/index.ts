import "dotenv/config";
import express from "express"
import logger from "./utils/logger.ts";
// import dotenv from 'dotenv'

const app = express();
const PORT = 3000;

// dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running on port 3000");
});

import userRouter from "./router/router.ts"
app.use("/api",userRouter)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
