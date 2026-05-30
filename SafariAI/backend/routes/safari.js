import express from "express";
import { SAFARI_CATEGORIES, SAFARI_INTERESTS } from "../utils/safariData.js";
import { discoverSafariPlan, getSafariActivityDetail } from "../utils/safariEngine.js";

const router = express.Router();

router.get("/meta", (req, res) => {
  res.json({
    success: true,
    categories: SAFARI_CATEGORIES,
    interests: SAFARI_INTERESTS,
    transportModes: ["walking", "driving", "public transport"],
    currencies: ["KES", "USD", "EUR", "GBP"],
  });
});

router.post("/discover", async (req, res, next) => {
  try {
    const result = await discoverSafariPlan(req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/activity/:id", async (req, res, next) => {
  try {
    const detail = await getSafariActivityDetail(req.params.id, req.query);

    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.json({
      success: true,
      activity: detail,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
