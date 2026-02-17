import "dotenv/config";
import express from "express"
import { auth,fetchUser } from "./controllers/auth.controller.ts";
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

app.post("/post",auth)
app.get("/user",fetchUser)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
