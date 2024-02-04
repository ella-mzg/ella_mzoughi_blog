import { NextResponse } from "next/server"

const genCookies = (...values) => {
  const { cookies } = new NextResponse()

  values.forEach((options) => {
    cookies.set(options)
  })

  return String(cookies)
}

export default genCookies
