import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // Only intercept for token refreshing/session updates natively via auth() wrapper.
    // Explicit redirects for layouts are handled securely via React Server Components (layout.tsx)
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
