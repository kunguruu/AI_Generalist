import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import safariRoutes from "./routes/safari.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "Safari AI backend", time: new Date().toISOString() });
});

app.use("/safari", safariRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Safari AI backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
