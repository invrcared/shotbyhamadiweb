import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { projectCode: string };
        const { projectCode } = body;

        if (!projectCode) {
            return NextResponse.json({ error: "Project code is required" }, { status: 400 });
        }

        const d1 = getRequestContext().env.shotbyhamadi_db;

        // Use case-insensitive comparison by using UPPER()
        const project = await d1.prepare("SELECT * FROM Projects WHERE UPPER(project_code) = UPPER(?)")
            .bind(projectCode)
            .first();

        if (!project) {
            return NextResponse.json({ error: "Invalid Project Code. Please check your invitation." }, { status: 401 });
        }


        // Get cookies
        const cookieStore = await cookies();

        // Store project code in cookie for middleware to match
        cookieStore.set("client_session", String(project.project_code), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
            sameSite: "lax",
        });

        // Redirect to /portal/[code]
        return NextResponse.json({ success: true, redirect: `/portal/${project.project_code}` });
    } catch (e) {
        console.error("Portal Auth Error", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
