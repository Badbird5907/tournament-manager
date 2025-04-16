import { env } from "@/env";

export const verifyToken = (token: string): boolean => {
  return token === env.PASSWORD;
}