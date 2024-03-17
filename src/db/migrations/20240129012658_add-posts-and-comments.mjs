export const up = async (knex) => {
  await knex.schema.createTable("posts", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.integer("views").defaultTo(0)
    table.timestamps(true, true, true)
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
  })
  await knex.schema.createTable("comments", (table) => {
    table.increments("id")
    table.text("content")
    table.timestamps(true, true, true)
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .integer("postId")
      .notNullable()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("comments")
  await knex.schema.dropTable("posts")
}
