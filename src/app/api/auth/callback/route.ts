import { client, setTokens, subjects } from "@/app/auth"
import { auth } from "@/app/auth/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const exchanged = await client.exchange(code!, `${url.origin}/api/auth/callback`)
  if (exchanged.err) return NextResponse.json(exchanged.err, { status: 400 })
  await setTokens(exchanged.tokens.access, exchanged.tokens.refresh)
  
  const verified = await client.verify(subjects, exchanged.tokens.access, {
    refresh: exchanged.tokens.refresh,
  })
  console.log("verified > ",verified);
  return NextResponse.redirect(`${url.origin}/`)
}