import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { zodToAppError } from "../infra/validation";
import { createPurchase, getPurchases } from "../services/purchase.service";

const createPurchaseSchema = z.object({
  item_id: z.number().int().positive(),
});

export async function createPurchaseController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createPurchaseSchema.safeParse(req.body);
    if (!parsed.success) throw zodToAppError(parsed.error);

    const purchase = await createPurchase(parsed.data.item_id);
    return res.status(201).json(purchase);
  } catch (e) {
    return next(e);
  }
}

export async function listPurchasesController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const purchases = await getPurchases();
    return res.status(200).json(purchases);
  } catch (e) {
    return next(e);
  }
}
