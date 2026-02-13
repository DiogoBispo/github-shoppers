import { createItem, listItems } from "../repositories/item.repository";

export async function createCatalogItem(input: {
  nome: string;
  preco: number;
  qtd_atual: number;
}) {
  const item = await createItem(input);

  // Normaliza preco para number na resposta (opcional, mas melhora DX)
  return {
    id: String(item.id),
    nome: item.nome,
    preco: Number(item.preco),
    qtd_atual: item.qtd_atual,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export async function getCatalogItems() {
  const items = await listItems();

  return items.map((i) => ({
    id: String(i.id),
    nome: i.nome,
    preco: Number(i.preco),
    qtd_atual: i.qtd_atual,
    created_at: i.created_at,
    updated_at: i.updated_at,
  }));
}
