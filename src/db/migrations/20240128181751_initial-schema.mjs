export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("username").notNullable().unique()
    table.text("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table
      .enum("role", ["user", "administrator", "author"], {
        useNative: true,
        enumName: "role"
      })
      .defaultTo("user")
    table.boolean("isDisabled").notNullable().defaultTo(false)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("users")
}
