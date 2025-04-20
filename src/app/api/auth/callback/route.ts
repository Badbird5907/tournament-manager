import { client, setTokens, subjects } from "@/app/auth"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"
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
  if (verified.err) return NextResponse.json(verified.err, { status: 400 })
  console.log("verified > ",verified);
  const { id } = verified.subject.properties;
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });
  if (!user) {
    await db.insert(users).values({
      id,
      email: verified.subject.properties.email,
      name: verified.subject.properties.email,
    })
  }
  
  return NextResponse.redirect(`${url.origin}/`)
}