import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json() as { id: number, status: string };
        const { id, status } = body;

        if (!id) {
            return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
        }

        // Validate Status matches expected ENUM values
        if (!['none', 'liked', 'disliked', 'favorite'].includes(status)) {
            return NextResponse.json({ error: "Invalid status state provided" }, { status: 400 });
        }

        const d1 = getRequestContext().env.shotbyhamadi_db;

        await d1.prepare("UPDATE Media SET client_status = ? WHERE id = ?").bind(status, id).run();

        return NextResponse.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        console.error("Failed to update media status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
