import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { register, login } from "../services/auth.service";
import { zodToAppError } from "../infra/validation";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) throw zodToAppError(parsed.error);

    const user = await register(parsed.data.email, parsed.data.password);
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw zodToAppError(parsed.error);

    const result = await login(parsed.data.email, parsed.data.password);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}
