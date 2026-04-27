const cors = require("cors");
const express = require("express");
const feedbackRoute = require("./routes/feedback");
const imagesRoute = require("./routes/images");
const metaRoute = require("./routes/meta");
const recommendationsRoute = require("./routes/recommendations");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "safari-ai-api" });
});

app.use("/api/meta", metaRoute);
app.use("/api/images", imagesRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/recommendations", recommendationsRoute);

module.exports = app;
