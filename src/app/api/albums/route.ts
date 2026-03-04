import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const slug = url.searchParams.get("slug");
        const publicOnly = url.searchParams.get("publicOnly") === "true";

        const d1 = getRequestContext().env.shotbyhamadi_db;

        if (slug) {
            const album = await d1.prepare("SELECT * FROM Albums WHERE slug = ?").bind(slug).first();
            if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });
            return NextResponse.json(album);
        }

        let query = "SELECT * FROM Albums";
        if (publicOnly) {
            query += " WHERE is_published = 1";
        }
        query += " ORDER BY created_at DESC";

        const { results } = await d1.prepare(query).all();
        return NextResponse.json(results);
    } catch (error) {
        console.error("Failed to fetch albums:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch albums" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json() as { title: string, slug: string, description?: string, cover_image_url?: string, is_published?: number, date?: string };
        const { title, slug, description, cover_image_url, is_published, date } = body;

        if (!title || !slug) {
            return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
        }

        const d1 = getRequestContext().env.shotbyhamadi_db;
        const res = await d1.prepare(
            `INSERT INTO Albums (title, slug, description, cover_image_url, is_published, date) 
             VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
            title,
            slug,
            description || null,
            cover_image_url || null,
            is_published ?? 1,
            date || null
        ).run();

        return NextResponse.json({ success: true, id: res.meta.last_row_id }, { status: 201 });
    } catch (error) {
        console.error("Failed to create album:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create album" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json() as { id: number, title?: string, slug?: string, description?: string, cover_image_url?: string, is_published?: number, date?: string };
        const { id, title, slug, description, cover_image_url, is_published, date } = body;

        if (!id) {
            return NextResponse.json({ error: "Album ID is required" }, { status: 400 });
        }

        const d1 = getRequestContext().env.shotbyhamadi_db;

        const updates = [];
        const bindings = [];

        if (title !== undefined) { updates.push("title = ?"); bindings.push(title); }
        if (slug !== undefined) { updates.push("slug = ?"); bindings.push(slug); }
        if (description !== undefined) { updates.push("description = ?"); bindings.push(description); }
        if (cover_image_url !== undefined) { updates.push("cover_image_url = ?"); bindings.push(cover_image_url); }
        if (is_published !== undefined) { updates.push("is_published = ?"); bindings.push(is_published); }
        if (date !== undefined) { updates.push("date = ?"); bindings.push(date); }

        if (updates.length === 0) return NextResponse.json({ success: true });

        bindings.push(id);

        const query = `UPDATE Albums SET ${updates.join(', ')} WHERE id = ?`;
        await d1.prepare(query).bind(...bindings).run();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Failed to update album:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update album" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const d1 = getRequestContext().env.shotbyhamadi_db;

        await d1.prepare("DELETE FROM Albums WHERE id = ?").bind(id).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete album:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete album" }, { status: 500 });
    }
}
