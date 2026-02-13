import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtClaims = {
  sub: string; // user id
  email: string;
};

export function signJwt(claims: JwtClaims): string {
  return jwt.sign(claims, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyJwt(token: string): JwtClaims {
  return jwt.verify(token, env.jwtSecret) as JwtClaims;
}
