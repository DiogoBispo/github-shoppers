import { Router } from "express";
import { pool } from "../db/pool";

export const healthRouter = Router();

healthRouter.get("/health", async (req, res, next) => {
  try {
    const startedAt = Date.now();
    await pool.query("select 1 as ok");
    const latencyMs = Date.now() - startedAt;

    return res.status(200).json({
      status: "ok",
      db: "ok",
      latency_ms: latencyMs,
      request_id: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});
