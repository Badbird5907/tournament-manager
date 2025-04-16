import {type NextRequest, NextResponse} from "next/server";
import {verifyToken} from "@/util/auth-server";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    // if we are on /admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // get the qrTrackerToken cookie
        const tmPassword = request.cookies.get("tmPassword");
        if (!tmPassword || !verifyToken(tmPassword.value)) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    } else if (request.nextUrl.pathname.startsWith("/api/admin")) {
        const tmPassword = request.cookies.get("tmPassword");
        if (!tmPassword || !verifyToken(tmPassword.value)) { // if the token is invalid
            // return 401
            const response = new Response(JSON.stringify({
                success: false,
                message: "Unauthorized",
                code: 401
            }), {
                status: 401,
            });
            response.headers.set("Content-Type", "application/json");
            return response;
        }
    }
    return NextResponse.next();
}