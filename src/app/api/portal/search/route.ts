import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const query = url.searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        const d1 = getRequestContext().env.shotbyhamadi_db;

        // Search for partial matches in either client_name or project_slug
        const searchQuery = `%${query}%`;
        const { results } = await d1.prepare(`
            SELECT project_slug, client_name, location 
            FROM Projects 
            WHERE client_name LIKE ? OR project_slug LIKE ? 
            LIMIT 5
        `).bind(searchQuery, searchQuery).all();

        return NextResponse.json(results);
    } catch (e) {
        console.error("Portal search error:", e);
        return NextResponse.json({ error: "Failed to search projects" }, { status: 500 });
    }
}
