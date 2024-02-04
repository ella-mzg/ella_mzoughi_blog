const crypto = require("crypto")
const util = require("util")
const { pbkdf2 } = crypto
const { randomBytes } = crypto
const { promisify } = util
const pbkdf2Async = promisify(pbkdf2)
const hashPassword = async (
  password,
  salt = randomBytes(128).toString("hex")
) => [
  (await pbkdf2Async(password, salt, 1_000_000, 256, "sha512")).toString("hex"),
  salt
]

module.exports = hashPassword
