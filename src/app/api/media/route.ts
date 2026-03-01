import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const categoryId = url.searchParams.get("categoryId");
        const publicOnly = url.searchParams.get("publicOnly") === "true";

        const d1 = getRequestContext().env.shotbyhamadi_db;

        let query = `
      SELECT Media.*, Categories.name as category_name, Categories.slug as category_slug
      FROM Media 
      LEFT JOIN Categories ON Media.category_id = Categories.id
    `;
        const conditions: string[] = [];
        const params: (string | number)[] = [];

        if (categoryId) {
            conditions.push("Media.category_id = ?");
            params.push(categoryId);
        }

        if (publicOnly) {
            conditions.push("Media.is_public = 1");
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY Media.created_at DESC";

        const { results } = await d1.prepare(query).bind(...params).all();

        const mediaWithPreviews = results.map((media: Record<string, unknown>) => ({
            ...media,
            url: typeof media.url === 'string' && media.url.startsWith('http') ? media.url : `/api/preview?key=${encodeURIComponent(media.url as string)}`
        }));

        return NextResponse.json(mediaWithPreviews);
    } catch (error) {
        console.error("Failed to fetch media:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch media" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json() as { url?: string, categoryId?: string, projectId?: string, altText?: string, isPublic?: boolean };
        const { url, categoryId, projectId, altText, isPublic } = body;

        if (!url) {
            return NextResponse.json({ error: "URL (R2 Key) is required" }, { status: 400 });
        }

        const isPublicValue = isPublic !== false ? 1 : 0; // Default to 1 (true)

        const d1 = getRequestContext().env.shotbyhamadi_db;
        await d1.prepare("INSERT INTO Media (url, category_id, project_id, alt_text, is_public) VALUES (?, ?, ?, ?, ?)")
            .bind(url, categoryId || null, projectId || null, altText || "Uploaded Image", isPublicValue)
            .run();

        return NextResponse.json({ success: true, url: `/api/preview?key=${encodeURIComponent(url)}` }, { status: 201 });
    } catch (error) {
        console.error("Failed to insert media record:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to insert media record" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const d1 = getRequestContext().env.shotbyhamadi_db;

        // In production, fetch the media URL and delete from R2 first
        await d1.prepare("DELETE FROM Media WHERE id = ?").bind(id).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete media:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete media" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json() as { id?: number, is_public?: boolean };
        const { id, is_public } = body;

        if (!id) {
            return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
        }

        const isPublicValue = is_public ? 1 : 0;

        const d1 = getRequestContext().env.shotbyhamadi_db;
        await d1.prepare("UPDATE Media SET is_public = ? WHERE id = ?")
            .bind(isPublicValue, id)
            .run();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Failed to update media record:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update media record" }, { status: 500 });
    }
}
