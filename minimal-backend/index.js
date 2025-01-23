import express from "express";
import cors from "cors";

const app = express();
const PORT = 8747;

app.use(
  cors({
    origin: "https://dreamqin68.github.io",
    credentials: true,
  })
);

app.use(express.json());

// New signup endpoint
app.post("/api/auth/signup", (req, res) => {
  // Extract user details from req.body
  const { username, password } = req.body;
  console.log("Signup request body:", req.body);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
