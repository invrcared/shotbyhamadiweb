import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET() {
    try {
        const d1 = getRequestContext().env.shotbyhamadi_db;

        const mediaCountResult = await d1.prepare("SELECT COUNT(*) as count FROM Media").first();
        const projectCountResult = await d1.prepare("SELECT COUNT(*) as count FROM Projects").first();

        const totalMedia = parseInt(mediaCountResult?.count as string) || 0;
        const mockAvgSizeMB = 2.4;
        const totalMb = totalMedia * mockAvgSizeMB;
        const storageString = totalMb > 1000 ? `${(totalMb / 1024).toFixed(1)} GB` : `${totalMb.toFixed(1)} MB`;

        return NextResponse.json({
            totalMedia,
            activeProjects: projectCountResult?.count || 0,
            storageUsed: storageString
        });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch stats" }, { status: 500 });
    }
}
