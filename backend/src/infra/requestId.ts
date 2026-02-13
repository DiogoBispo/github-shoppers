import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const incoming = req.header("X-Request-Id");
  const id = incoming && incoming.trim().length > 0 ? incoming : randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-Id", id);

  next();
}
