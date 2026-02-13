import { pool } from "../db/pool";

export type DbUser = {
  id: number;
  email: string;
  password_hash: string;
};

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const res = await pool.query<DbUser>(
    `SELECT id, email, password_hash
     FROM usuarios
     WHERE email = $1
     LIMIT 1`,
    [email],
  );
  return res.rows[0] ?? null;
}

export async function createUser(params: {
  email: string;
  passwordHash: string;
}): Promise<Pick<DbUser, "id" | "email">> {
  const res = await pool.query<{ id: number; email: string }>(
    `INSERT INTO usuarios (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email`,
    [params.email, params.passwordHash],
  );
  return res.rows[0];
}
