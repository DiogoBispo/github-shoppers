import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("usuarios", (t) => {
    t.bigIncrements("id").primary();
    t.string("email").notNullable().unique();
    t.string("password_hash").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("itens", (t) => {
    t.bigIncrements("id").primary();
    t.text("nome").notNullable();
    t.decimal("preco", 12, 2).notNullable();
    t.integer("qtd_atual").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index(["nome"], "idx_itens_nome");
  });

  await knex.schema.createTable("compras", (t) => {
    t.bigIncrements("id").primary();
    t.bigInteger("item_id")
      .notNullable()
      .references("id")
      .inTable("itens")
      .onDelete("RESTRICT");
    t.text("comprador_github_login").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index(["item_id"], "idx_compras_item_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("compras");
  await knex.schema.dropTableIfExists("itens");
  await knex.schema.dropTableIfExists("usuarios");
}
