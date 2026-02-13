import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { zodToAppError } from "../infra/validation";
import { createCatalogItem, getCatalogItems } from "../services/item.service";

const createItemSchema = z.object({
  nome: z.string().min(1),
  preco: z.number().positive(),
  qtd_atual: z.number().int().nonnegative(),
});

export async function createItemController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createItemSchema.safeParse(req.body);
    if (!parsed.success) throw zodToAppError(parsed.error);

    const item = await createCatalogItem(parsed.data);
    return res.status(201).json(item);
  } catch (err) {
    return next(err);
  }
}

export async function listItemsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const items = await getCatalogItems();
    return res.status(200).json(items);
  } catch (err) {
    return next(err);
  }
}
