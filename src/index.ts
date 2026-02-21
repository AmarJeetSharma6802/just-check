import "dotenv/config";
import app from "./app.ts";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
