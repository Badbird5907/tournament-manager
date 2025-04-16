"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";


const LoginCard = () => {
  const [password, setPassword] = React.useState("");
  const [isPending, startTransistion] = React.useTransition();
  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
          <CardTitle>
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" />
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => {
              startTransistion(async () => {
                const response = await fetch("/api/auth/signin", {
                  method: "POST",
                  body: JSON.stringify({ password }),
                });
                const result = await response.json() as unknown as { success: boolean; message: string };
                if (result.success) {
                  window.location.href = "/admin";
                } else {
                  toast.error(result.message);
                }
              })
            }}>
            {isPending ? "Loading..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginCard;