import { AppError } from "../infra/errors";
import { getRandomGithubLogin } from "../infra/githubClient";
import {
  createPurchaseAtomic,
  listPurchasesWithItem,
} from "../repositories/purchase.repository";

export async function createPurchase(itemId: number) {
  // 1) buyer da GitHub API
  const buyerLogin = await getRandomGithubLogin();

  // 2) transação atômica: decremento + insert compra
  const result = await createPurchaseAtomic({ itemId, buyerLogin });

  if (result.kind === "OUT_OF_STOCK") {
    // requisito do desafio: 409 Conflict com mensagem clara :contentReference[oaicite:1]{index=1}
    throw new AppError({
      status: 409,
      code: "VALIDATION_ERROR",
      message: "Item fora de estoque.",
    });
  }

  return {
    id: String(result.purchase.id),
    item_id: String(result.purchase.item_id),
    comprador_github_login: result.purchase.comprador_github_login,
    created_at: result.purchase.created_at,
  };
}

export async function getPurchases() {
  const rows = await listPurchasesWithItem();

  return rows.map((r) => ({
    id: String(r.id),
    comprador_github_login: r.comprador_github_login,
    created_at: r.created_at,
    item: {
      id: String(r.item_id),
      nome: r.item_nome,
      preco: Number(r.item_preco),
    },
  }));
}
