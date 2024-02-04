export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("username").notNullable().unique()
    table.text("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.boolean("isAuthor").notNullable().defaultTo(false)
    table.boolean("isAdmin").notNullable().defaultTo(false)
    table.boolean("isDisabled").notNullable().defaultTo(false)
    table.timestamp("deletedAt")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("users")
}
