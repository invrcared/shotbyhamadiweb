import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    console.log("Middleware running for path:", req.nextUrl.pathname);

    const isLoggedIn = !!req.auth;
    const isAuthApiRoute = req.nextUrl.pathname.startsWith("/api/auth");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");

    if (isAuthApiRoute) {
        return NextResponse.next();
    }



    if (isLoginPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/admin", req.nextUrl));
        }
        return NextResponse.next();
    }

    if (isOnAdmin && !isLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
