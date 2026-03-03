import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE: We intentionally do NOT use the NextAuth `auth()` wrapper here.
// The auth() wrapper implicitly redirects unauthenticated users to pages.signIn,
// which caused an infinite redirect loop when visiting /admin/login itself.
// Admin route protection is handled securely in (dashboard)/layout.tsx via
// React Server Components with an explicit session check.
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
