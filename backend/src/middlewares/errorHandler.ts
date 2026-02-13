import { Request, Response, NextFunction } from "express";
import { AppError } from "../infra/errors";
import { logger } from "../infra/logger";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    logger.warn("Handled application error", {
      requestId,
      code: err.code,
      status: err.status,
      message: err.message,
      details: err.details,
    });

    return res.status(err.status).json({
      error: { code: err.code, message: err.message },
      request_id: requestId,
    });
  }

  logger.error("Unhandled error", {
    requestId,
    err:
      err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : { value: err },
  });

  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Erro interno." },
    request_id: requestId,
  });
}
