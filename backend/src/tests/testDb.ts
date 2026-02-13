import { pool } from "../db/pool";

export async function resetDb() {
  // ordem importa por FK
  await pool.query("DELETE FROM compras");
  await pool.query("DELETE FROM itens");
  await pool.query("DELETE FROM usuarios");
}

export async function closeDb() {
  await pool.end();
}
