import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import hashPassword from "@/db/hashPassword"
import {
  emailValidator,
  pageValidator,
  passwordValidator,
  usernameValidator
} from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      body: {
        username: usernameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required()
      }
    }),
    async ({
      send,
      input: {
        body: { username, email, password }
      },
      models: { UserModel }
    }) => {
      const normalizedEmail = email.toLowerCase()
      const usernameExists = await UserModel.query().findOne({ username })

      if (usernameExists) {
        throw new Error("Something went wrong.")
      }

      const emailExists = await UserModel.query().findOne({
        email: normalizedEmail
      })

      if (emailExists) {
        throw new Error("Something went wrong.")
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await UserModel.query().insert({
        username,
        email: normalizedEmail,
        passwordHash,
        passwordSalt
      })

      send(true)
    }
  ],
  GET: [
    validate({
      query: {
        page: pageValidator.required()
      }
    }),
    async ({
      send,
      input: {
        query: { page }
      },
      models: { UserModel }
    }) => {
      const query = UserModel.query()
      const users = await query.clone().page(page)
      const [{ count }] = await query.clone().count()

      send(users, { count })
    }
  ]
})

export default handle
