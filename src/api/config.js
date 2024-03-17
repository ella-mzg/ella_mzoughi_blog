import knexfile from "@@/knexfile.mjs"
import { ValidationError, boolean, object, string } from "yup"

const validationSchema = object({
  isDevMode: boolean().default(false),
  db: object({
    client: string().oneOf(["pg"]).required(),
    connection: string().required()
  }).noUnknown(),
  logger: object({
    paths: object({
      info: string().required()
    }).noUnknown()
  }).noUnknown(),
  security: object({
    jwt: object({
      secret: string().required(),
      expiresIn: string().required()
    })
  })
})
let config = null

try {
  config = validationSchema.validateSync(
    {
      isDevMode: process.env.NODE_ENV === "development",
      db: knexfile,
      logger: {
        paths: {
          info: process.env.LOGGER__PATHS__INFO
        }
      },
      security: {
        jwt: {
          secret: process.env.SECURITY__JWT__SECRET,
          expiresIn: "2 days"
        }
      }
    },
    { abortEarly: false }
  )
} catch (err) {
  if (!(err instanceof ValidationError)) {
    throw err
  }

  // eslint-disable-next-line no-console
  console.error(
    `Error: Missing values for config\n\t${err.errors.join("\n\t")}`.trim()
  )
  process.exit(1)
}

export default config
