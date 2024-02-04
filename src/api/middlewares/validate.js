import { HttpArgumentsError } from "@/api/errors"
import { merge } from "@corex/deepmerge"
import { ValidationError, object } from "yup"

const validate =
  ({ query: queryValidator, body: bodyValidator }) =>
  async (ctx) => {
    const { req, next } = ctx

    try {
      const sanitizedInput = await object(
        merge([
          queryValidator ? { query: object(queryValidator) } : {},
          bodyValidator ? { body: object(bodyValidator) } : {}
        ])
      )
        .noUnknown()
        .validate(
          merge([
            queryValidator ? { query: req.query || {} } : {},
            bodyValidator ? { body: req.body || {} } : {}
          ]),
          {
            abortEarly: false
          }
        )
      ctx.input = sanitizedInput

      await next()
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new HttpArgumentsError(err.errors)
      }

      throw err
    }
  }

export default validate
