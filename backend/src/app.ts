import express from "express";
import { requestIdMiddleware } from "./infra/requestId";
import { logger } from "./infra/logger";
import { healthRouter } from "./routes/health.routes";
import { authRouter } from "./routes/auth.routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import { itemRouter } from "./routes/item.routes";
import { purchaseRouter } from "./routes/purchase.routes";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);

  app.use((req, _res, next) => {
    logger.info("HTTP request", {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
    });
    next();
  });

  app.use(healthRouter);
  app.use(authRouter);
  app.use(itemRouter);
  app.use(purchaseRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
