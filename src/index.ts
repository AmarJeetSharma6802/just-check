import express from "express"
import { auth } from "./controllers/auth.controller.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running on port 3000");
});

app.post("/post",auth)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
