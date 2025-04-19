import { auth, login, logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const subject = await auth();
  return (
    <div className="flex items-center justify-center min-h-svh">

      {subject ? (
        <div>
          <pre>{JSON.stringify(subject, null, 2)}</pre>
          <Button size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Hello World</h1>
            <Button size="sm" onClick={login}>
              Login
            </Button>
            </div>
        </div>
      )}
    </div>
  )
}
