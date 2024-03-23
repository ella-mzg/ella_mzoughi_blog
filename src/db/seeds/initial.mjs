import { faker } from "@faker-js/faker"
import hashPassword from "../hashPassword.js"

export const seed = async (db) => {
  const baseDate = new Date()
  const incrementStep = 1000
  const users = await Promise.all(
    [...new Array(10)].map(async () => {
      const userFirstName = faker.person.firstName()
      const userLastName = faker.person.lastName()
      const [userPasswordHash, userPasswordSalt] =
        await hashPassword("password")
      let role = ""

      if (faker.datatype.boolean()) {
        role = "author"
      } else {
        role = faker.datatype.boolean() ? "administrator" : "user"
      }

      return {
        username: faker.internet.userName({
          firstName: userFirstName,
          lastName: userLastName
        }),
        email: faker.internet
          .email({
            firstName: userFirstName,
            lastName: userLastName
          })
          .toLowerCase(),
        passwordHash: userPasswordHash,
        passwordSalt: userPasswordSalt,
        role
      }
    })
  )
  const insertedUsers = await db("users").insert(users).returning("*")
  const posts = [...new Array(10)].map((_, index) => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    userId:
      insertedUsers[faker.number.int({ min: 0, max: insertedUsers.length - 1 })]
        .id,
    createdAt: new Date(baseDate.getTime() + index * incrementStep)
  }))
  const insertedPosts = await db("posts").insert(posts).returning("*")
  const comments = [...new Array(20)].map((_, index) => ({
    content: faker.lorem.paragraph(),
    userId:
      insertedUsers[faker.number.int({ min: 0, max: insertedUsers.length - 1 })]
        .id,
    postId:
      insertedPosts[faker.number.int({ min: 0, max: insertedPosts.length - 1 })]
        .id,
    createdAt: new Date(baseDate.getTime() + index * incrementStep)
  }))

  await db("comments").insert(comments)
}
