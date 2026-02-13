import { Request, Response, NextFunction } from "express";
import { AppError } from "../infra/errors";
import { verifyJwt } from "../infra/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("Authorization");
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : null;

  if (!token) {
    return next(
      new AppError({
        status: 401,
        code: "VALIDATION_ERROR",
        message: "Não autenticado.",
      }),
    );
  }

  try {
    const claims = verifyJwt(token);
    req.user = { id: claims.sub, email: claims.email };
    return next();
  } catch {
    return next(
      new AppError({
        status: 401,
        code: "VALIDATION_ERROR",
        message: "Token inválido.",
      }),
    );
  }
}
