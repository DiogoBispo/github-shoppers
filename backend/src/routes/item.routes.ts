import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  createItemController,
  listItemsController,
} from "../controllers/item.controller";

export const itemRouter = Router();

// Protegidas por JWT (requisito do desafio)
itemRouter.post("/itens", requireAuth, createItemController);
itemRouter.get("/itens", requireAuth, listItemsController);
