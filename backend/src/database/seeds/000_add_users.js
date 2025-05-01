const bcrypt = require("bcrypt")

exports.seed = async (knex) => {
  await knex("users").del()

  const hashedPassword = await bcrypt.hash("admin", 10)

  await knex("users").insert([
    {
      name: "Administrator",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])
}
