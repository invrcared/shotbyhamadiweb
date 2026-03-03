import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET() {
    try {
        const d1 = getRequestContext().env.shotbyhamadi_db;
        const { results } = await d1.prepare("SELECT * FROM Services ORDER BY id ASC").all();
        return NextResponse.json(results);
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch services" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: {
            title?: string;
            description?: string;
            price?: number;
            features?: string[];
            category?: string;
            travel_fee?: number;
            policy_note?: string;
            is_active?: number;
        } = await req.json();

        const { title, description, price, features, category, travel_fee, policy_note, is_active } = body;
        if (!title || price === undefined) return NextResponse.json({ error: "Title and price are required" }, { status: 400 });

        const d1 = getRequestContext().env.shotbyhamadi_db;
        await d1.prepare(
            "INSERT INTO Services (title, description, price, features, category, travel_fee, policy_note, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
            title,
            description || "",
            price,
            JSON.stringify(features || []),
            category || "General",
            travel_fee ?? 0,
            policy_note || "",
            is_active ?? 1
        ).run();

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Failed to create service:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create service" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body: {
            id?: number;
            title?: string;
            description?: string;
            price?: number;
            features?: string[];
            category?: string;
            travel_fee?: number;
            policy_note?: string;
            is_active?: number;
        } = await req.json();

        const { id, title, description, price, features, category, travel_fee, policy_note, is_active } = body;
        if (!id || !title || price === undefined) return NextResponse.json({ error: "ID, title, and price are required" }, { status: 400 });

        const d1 = getRequestContext().env.shotbyhamadi_db;
        await d1.prepare(
            "UPDATE Services SET title = ?, description = ?, price = ?, features = ?, category = ?, travel_fee = ?, policy_note = ?, is_active = ? WHERE id = ?"
        ).bind(
            title,
            description || "",
            price,
            JSON.stringify(features || []),
            category || "General",
            travel_fee ?? 0,
            policy_note || "",
            is_active ?? 1,
            id
        ).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update service:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update service" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const d1 = getRequestContext().env.shotbyhamadi_db;
        await d1.prepare("DELETE FROM Services WHERE id = ?").bind(id).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete service:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete service" }, { status: 500 });
    }
}
