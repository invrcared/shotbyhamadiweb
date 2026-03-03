"use server";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { cookies } from "next/headers";

export async function authenticatePortalAction(projectCode: string) {
    if (!projectCode) return { error: "Project code is required." };

    try {
        const d1 = getRequestContext().env.shotbyhamadi_db;

        // Find project matching the exact code
        const project = await d1.prepare("SELECT * FROM Projects WHERE project_code = ?")
            .bind(projectCode.toUpperCase())
            .first();

        if (!project) {
            return { error: "Invalid Project Code. Please check your invitation." };
        }

        // Set secure, short-lived session cookie for this specific gallery
        const cookieStore = await cookies();
        cookieStore.set("client_session", project.id as string, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/portal",
            domain: process.env.NODE_ENV === "production" ? ".shotbyhamadi.com" : undefined,
            sameSite: "lax",
        });

        return { success: true, projectId: project.id as string };
    } catch (e) {
        console.error("Portal Auth Error", e);
        return { error: "Internal server error connecting to secure registry." };
    }
}
