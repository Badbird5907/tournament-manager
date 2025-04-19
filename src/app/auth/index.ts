import { env } from "@/env"
import { createClient } from "@openauthjs/openauth/client"
import { cookies as getCookies } from "next/headers"
export { subjects } from "@badbird5907/auth-commons"
export const client = createClient({
  clientID: env.OPENAUTH_CLIENT_ID,
  issuer: env.OPENAUTH_ISSUER,
})

export async function setTokens(access: string, refresh: string) {
  const cookies = await getCookies()

  cookies.set({
    name: "access_token",
    value: access,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  })
  cookies.set({
    name: "refresh_token",
    value: refresh,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  })
}