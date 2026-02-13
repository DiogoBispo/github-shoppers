import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  createPurchaseController,
  listPurchasesController,
} from "../controllers/purchase.controller";

export const purchaseRouter = Router();

purchaseRouter.post("/compras", requireAuth, createPurchaseController);
purchaseRouter.get("/compras", requireAuth, listPurchasesController);
