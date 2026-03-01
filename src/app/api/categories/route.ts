import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const activeOnly = url.searchParams.get("active") === "true";

        const d1 = getRequestContext().env.shotbyhamadi_db;

        let query = "SELECT * FROM Categories ORDER BY name ASC";
        if (activeOnly) {
            query = "SELECT * FROM Categories WHERE EXISTS (SELECT 1 FROM Media WHERE category_id = Categories.id) ORDER BY name ASC";
        }

        const { results } = await d1.prepare(query).all();
        return NextResponse.json(results);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: { name?: string } = await req.json();
        const name = body.name;
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        const d1 = getRequestContext().env.shotbyhamadi_db;

        // Check if category exists
        const existing = await d1.prepare("SELECT id FROM Categories WHERE slug = ?").bind(slug).first();
        if (existing) {
            return NextResponse.json({ error: "Category already exists" }, { status: 409 });
        }

        await d1.prepare("INSERT INTO Categories (name, slug) VALUES (?, ?)").bind(name, slug).run();

        return NextResponse.json({ success: true, name, slug }, { status: 201 });
    } catch (error) {
        console.error("Failed to create category:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create category" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const d1 = getRequestContext().env.shotbyhamadi_db;
        await d1.prepare("DELETE FROM Categories WHERE id = ?").bind(id).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete category:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete category" }, { status: 500 });
    }
}
