import { pool } from "../db/pool";

export type DbPurchaseJoinRow = {
  id: number;
  item_id: number;
  comprador_github_login: string;
  created_at: string;

  item_nome: string;
  item_preco: string;
};

export async function listPurchasesWithItem(): Promise<DbPurchaseJoinRow[]> {
  const res = await pool.query<DbPurchaseJoinRow>(
    `
    SELECT
      c.id,
      c.item_id,
      c.comprador_github_login,
      c.created_at,
      i.nome AS item_nome,
      i.preco AS item_preco
    FROM compras c
    JOIN itens i ON i.id = c.item_id
    ORDER BY c.id DESC
    `,
  );
  return res.rows;
}

export async function createPurchaseAtomic(params: {
  itemId: number;
  buyerLogin: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // decremento condicional: se não decrementar, não há estoque (rowCount=0)
    const dec = await client.query<{
      id: number;
      nome: string;
      preco: string;
      qtd_atual: number;
    }>(
      `
      UPDATE itens
      SET qtd_atual = qtd_atual - 1,
          updated_at = NOW()
      WHERE id = $1
        AND qtd_atual > 0
      RETURNING id, nome, preco, qtd_atual
      `,
      [params.itemId],
    );

    if (dec.rowCount === 0) {
      await client.query("ROLLBACK");
      return { kind: "OUT_OF_STOCK" as const };
    }

    const ins = await client.query<{
      id: number;
      item_id: number;
      comprador_github_login: string;
      created_at: string;
    }>(
      `
      INSERT INTO compras (item_id, comprador_github_login)
      VALUES ($1, $2)
      RETURNING id, item_id, comprador_github_login, created_at
      `,
      [params.itemId, params.buyerLogin],
    );

    await client.query("COMMIT");

    return {
      kind: "OK" as const,
      purchase: ins.rows[0],
    };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
