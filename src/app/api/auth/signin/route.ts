import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import { verifyToken } from "@/util/auth-server";

export async function POST(req: Request) {
    const token = (await req.json() as { password?: string }).password;
    if (typeof token !== "string") {
        return NextResponse.json({
            success: false,
            message: `Expected string but got ${typeof token}`,
        })
    }
    const valid = verifyToken(token);
    (await cookies()).set("tmPassword", token, {
        httpOnly: true,
    })
    return NextResponse.json({
        success: valid,
    });
}