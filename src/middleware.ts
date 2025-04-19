import { auth } from "@/app/auth/actions";
import { type NextRequest, NextResponse } from "next/server";
export default async function middleware(request: NextRequest) {
  const subject = await auth();
  const head = new Headers(request.headers);
  head.delete("__auth"); // don't let the client set the subject
  if (subject) {
    head.set("__auth", JSON.stringify(subject.properties));
  }
  return NextResponse.next({
    request: {
      headers: head
    }
  });
}
