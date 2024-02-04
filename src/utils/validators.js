import { boolean, number, string } from "yup"

export const titleValidator = string().min(3).max(30)

export const postContentValidator = string().min(50).max(1000)

export const commentContentValidator = string().min(3).max(250)

export const booleanValidator = boolean().default(false)

export const idValidator = number().min(1)

export const pageValidator = number().min(1).default(1).required()

export const usernameValidator = string().min(3).max(20)

export const emailValidator = string().email()

export const passwordValidator = string()
  .min(8)
  .matches(
    /(?=.*\p{Lu})(?=.*\p{Ll})(?=.*\d)(?=.*[^\d\p{L}]).*/u,
    "Must contain: 1 lower & 1 upper letters, 1 digit and 1 special character."
  )
