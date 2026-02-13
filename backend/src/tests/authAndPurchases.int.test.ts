import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { resetDb, closeDb } from "./testDb";

const app = createApp();

async function registerAndLogin() {
  const email = `user_${Date.now()}@test.com`;
  const password = "123456";

  const reg = await request(app)
    .post("/auth/register")
    .send({ email, password });

  expect(reg.status).toBe(201);

  const login = await request(app)
    .post("/auth/login")
    .send({ email, password });

  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();

  return login.body.token as string;
}

describe("Integration - Auth, Itens, Compras", () => {
  beforeAll(async () => {
    // nada
  });

  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await closeDb();
  });

  it("should protect /itens without auth", async () => {
    const res = await request(app).get("/itens");
    expect(res.status).toBe(401);
  });

  it("should create purchase with stock available and decrement stock", async () => {
    const token = await registerAndLogin();

    // cria item com estoque 2
    const created = await request(app)
      .post("/itens")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Notebook Gamer", preco: 7500, qtd_atual: 2 });

    expect(created.status).toBe(201);
    const itemId = Number(created.body.id);
    expect(itemId).toBeGreaterThan(0);

    // compra 1
    const purchase1 = await request(app)
      .post("/compras")
      .set("Authorization", `Bearer ${token}`)
      .send({ item_id: itemId });

    expect(purchase1.status).toBe(201);
    expect(purchase1.body.comprador_github_login).toBeTruthy();

    // verifica estoque decrementado via GET /itens
    const items = await request(app)
      .get("/itens")
      .set("Authorization", `Bearer ${token}`);

    expect(items.status).toBe(200);
    const found = items.body.find((x: any) => Number(x.id) === itemId);
    expect(found).toBeTruthy();
    expect(found.qtd_atual).toBe(1);
  });

  it("should return 409 when trying to purchase item with no stock", async () => {
    const token = await registerAndLogin();

    // cria item com estoque 1
    const created = await request(app)
      .post("/itens")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Mouse Gamer", preco: 199.9, qtd_atual: 1 });

    expect(created.status).toBe(201);
    const itemId = Number(created.body.id);

    // compra 1 ok
    const ok = await request(app)
      .post("/compras")
      .set("Authorization", `Bearer ${token}`)
      .send({ item_id: itemId });

    expect(ok.status).toBe(201);

    // compra 2 -> 409
    const fail = await request(app)
      .post("/compras")
      .set("Authorization", `Bearer ${token}`)
      .send({ item_id: itemId });

    expect(fail.status).toBe(409);
    expect(fail.body?.error?.message).toBe("Item fora de estoque.");
  });

  it("GET /compras should include joined item data", async () => {
    const token = await registerAndLogin();

    const created = await request(app)
      .post("/itens")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Headset", preco: 399.9, qtd_atual: 1 });

    const itemId = Number(created.body.id);

    await request(app)
      .post("/compras")
      .set("Authorization", `Bearer ${token}`)
      .send({ item_id: itemId });

    const list = await request(app)
      .get("/compras")
      .set("Authorization", `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThan(0);

    const first = list.body[0];
    expect(first.item?.nome).toBeTruthy();
    expect(typeof first.item?.preco).toBe("number");
  });
});
