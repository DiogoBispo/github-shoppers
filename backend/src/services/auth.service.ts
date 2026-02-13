import { AppError } from "../infra/errors";
import { hashPassword, comparePassword } from "../infra/password";
import { signJwt } from "../infra/jwt";
import { createUser, findUserByEmail } from "../repositories/user.repository";

export async function register(email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError({
      status: 409,
      code: "VALIDATION_ERROR",
      message: "Email já cadastrado.",
    });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, passwordHash });

  return { id: user.id, email: user.email };
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError({
      status: 401,
      code: "VALIDATION_ERROR",
      message: "Credenciais inválidas.",
    });
  }

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    throw new AppError({
      status: 401,
      code: "VALIDATION_ERROR",
      message: "Credenciais inválidas.",
    });
  }

  const token = signJwt({ sub: String(user.id), email: user.email });
  return { token };
}
