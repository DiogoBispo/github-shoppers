import { ZodError } from "zod";
import { AppError } from "./errors";

export function zodToAppError(err: ZodError) {
  const details = err.flatten();
  return new AppError({
    status: 400,
    code: "VALIDATION_ERROR",
    message: "Dados inválidos.",
    details,
  });
}
