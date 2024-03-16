import { createContext } from "@/api/createContext"
import {
  HttpForbiddenError,
  HttpNotFoundError,
  HttpPublicError,
  PublicError
} from "@/api/errors"
import createLogger, { SCOPES } from "@/api/utils/createLogger"
import { HTTP_ERRORS } from "@/pages/api/constants"
import { JsonWebTokenError } from "jsonwebtoken"
import { randomUUID } from "node:crypto"
import { NotFoundError } from "objection"

// eslint-disable-next-line no-unused-vars
const handleError = (err, { res, logger }) => {
  const error = (() => {
    if (err instanceof JsonWebTokenError) {
      return new HttpForbiddenError()
    }

    if (err instanceof NotFoundError) {
      return new HttpNotFoundError()
    }

    return err
  })()

  if (!(error instanceof PublicError)) {
    res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .send({ error: "Something went wrong." })

    // Logger.info(error)
    // eslint-disable-next-line no-console
    console.log(error)

    return
  }

  if (error instanceof HttpPublicError) {
    res.status(error.statusCode)
  }

  res.send({ error: error.message })
}
const mw = (methodHandlers) => async (req, res) => {
  const requestId = randomUUID()
  const logger = {
    info: createLogger(SCOPES.INFO),
    debug: createLogger(SCOPES.DEBUG),
    error: createLogger(SCOPES.ERROR)
  }
  logger.info({ type: "HTTP", requestId, method: req.method, url: req.url })

  const handlers = methodHandlers[req.method.toUpperCase()]

  if (!handlers) {
    res.status(HTTP_ERRORS.NOT_FOUND).send({ error: "Method not allowed" })

    return
  }

  let currentHandlerIndex = -1
  const next = async () => {
    currentHandlerIndex += 1
    const handleNext = handlers[currentHandlerIndex]

    await handleNext(ctx)
  }
  const ctx = createContext({
    req,
    res,
    next,
    requestId,
    logger
  })

  try {
    await next()
  } catch (err) {
    await handleError(err, ctx)
  } finally {
    await ctx.db.destroy()
  }
}

export default mw
