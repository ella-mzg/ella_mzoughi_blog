import config from "@/api/config"
import { HttpForbiddenError } from "@/api/errors"
import webConfig from "@/web/config"
import jsonwebtoken from "jsonwebtoken"

const auth = async ({
  req: {
    headers: { authorization },
    cookies: { [webConfig.security.session.cookie.key]: cookies }
  },
  next
}) => {
  jsonwebtoken.verify(authorization, config.security.jwt.secret)

  const cookiesJwt = jsonwebtoken.verify(cookies, config.security.jwt.secret)

  if (cookiesJwt.payload !== authorization) {
    throw new HttpForbiddenError()
  }

  await next()
}

export default auth
