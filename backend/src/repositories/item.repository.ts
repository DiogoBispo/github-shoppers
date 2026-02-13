import { pool } from "../db/pool";

export type DbItem = {
  id: number;
  nome: string;
  preco: string; // pg retorna decimal como string
  qtd_atual: number;
  created_at: string;
  updated_at: string;
};

export async function createItem(params: {
  nome: string;
  preco: number;
  qtd_atual: number;
}) {
  const res = await pool.query<DbItem>(
    `INSERT INTO itens (nome, preco, qtd_atual)
     VALUES ($1, $2, $3)
     RETURNING id, nome, preco, qtd_atual, created_at, updated_at`,
    [params.nome, params.preco, params.qtd_atual],
  );
  return res.rows[0];
}

export async function listItems(): Promise<DbItem[]> {
  const res = await pool.query<DbItem>(
    `SELECT id, nome, preco, qtd_atual, created_at, updated_at
     FROM itens
     ORDER BY id DESC`,
  );
  return res.rows;
}
