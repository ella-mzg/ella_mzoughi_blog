import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import hashPassword from "@/db/hashPassword"
import { AVERAGE_PASSWORD_HASHING_DURATION } from "@/pages/api/constants"
import sleep from "@/utils/sleep"
import {
  emailValidator,
  passwordValidator,
  usernameValidator
} from "@/utils/validators"

const handle = mw({
  GET: [
    async ({ send, models: { UserModel } }) => {
      const users = await UserModel.query()
      send(users)
    }
  ],
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
      const usernameExists = await UserModel.query().findOne({ username })

      if (usernameExists) {
        await sleep(AVERAGE_PASSWORD_HASHING_DURATION)

        send(true)

        return
      }

      const emailExists = await UserModel.query().findOne({ email })

      if (emailExists) {
        await sleep(AVERAGE_PASSWORD_HASHING_DURATION)

        send(true)

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await UserModel.query().insert({
        username,
        email,
        passwordHash,
        passwordSalt
      })

      send(true)
    }
  ]
})

export default handle
