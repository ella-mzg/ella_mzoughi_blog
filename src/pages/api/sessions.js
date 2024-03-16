import config from "@/api/config"
import { HttpAuthenticationError } from "@/api/errors"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import genCookies from "@/api/utils/genCookies"
import hashPassword from "@/db/hashPassword"
import { AVERAGE_PASSWORD_HASHING_DURATION } from "@/pages/api/constants"
import sleep from "@/utils/sleep"
import { emailValidator } from "@/utils/validators"
import webConfig from "@/web/config"
import jsonwebtoken from "jsonwebtoken"
import ms from "ms"
import { string } from "yup"

const handle = mw({
  POST: [
    validate({
      body: {
        email: emailValidator.required(),
        password: string().required()
      }
    }),
    async ({
      send,
      res,
      input: {
        body: { email, password }
      },
      models: { UserModel }
    }) => {
      const normalizedEmail = email.toLowerCase()
      const user = await UserModel.query().findOne({ email: normalizedEmail })

      if (!user) {
        await sleep(AVERAGE_PASSWORD_HASHING_DURATION)

        throw new HttpAuthenticationError()
      }

      const [passwordHash] = await hashPassword(password, user.passwordSalt)

      if (passwordHash !== user.passwordHash) {
        throw new HttpAuthenticationError()
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              role: user.role
            }
          }
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      )
      const cookieJwt = jsonwebtoken.sign(
        { payload: jwt },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      )

      res.setHeader(
        "set-cookie",
        genCookies({
          name: webConfig.security.session.cookie.key,
          value: cookieJwt,
          expires: Date.now() + ms(config.security.jwt.expiresIn),
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          secure: webConfig.security.session.cookie.secure
        })
      )
      send(jwt)
    }
  ],
  DELETE: [
    ({ send, res }) => {
      res.setHeader(
        "set-cookie",
        genCookies({
          name: webConfig.security.session.cookie.key,
          value: "null",
          expires: Date.now() - ms("10 years"),
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          secure: webConfig.security.session.cookie.secure
        })
      )
      send(true)
    }
  ]
})

export default handle
