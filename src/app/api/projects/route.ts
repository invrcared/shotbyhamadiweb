import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET() {
    try {
        const d1 = getRequestContext().env.shotbyhamadi_db;
        const result = await d1.prepare("SELECT * FROM Projects ORDER BY created_at DESC").all();

        // Map to frontend expected format
        const projects = result.results.map(p => ({
            id: p.id,
            client: p.client_name,
            code: p.project_code,
            slug: p.project_slug,
            date: p.created_at,
            basePrice: p.base_price,
            travelSurcharge: p.travel_surcharge,
            notes: p.notes
        }));

        return NextResponse.json(projects);
    } catch (e) {
        console.error("Failed to fetch projects", e);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as {
            clientName: string,
            projectSlug?: string,
            location?: string,
            projectPassword?: string,
            basePrice?: number,
            travelSurcharge?: number,
            notes?: string
        };
        const { clientName, projectSlug, location, projectPassword, basePrice, travelSurcharge, notes } = body;

        if (!clientName) {
            return NextResponse.json({ error: "Client name is required" }, { status: 400 });
        }

        const d1 = getRequestContext().env.shotbyhamadi_db;

        const finalSlug = projectSlug?.trim() || clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingSlugCheck = await d1.prepare("SELECT * FROM Projects WHERE project_slug = ?").bind(finalSlug).first();
        if (existingSlugCheck) {
            return NextResponse.json({ error: "URL Slug is already taken. Please manually provide a unique one." }, { status: 400 });
        }

        const projectCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const date = new Date().toISOString().split('T')[0];
        const id = crypto.randomUUID();
        const finalLocation = location || "United States";

        await d1.prepare(`
            INSERT INTO Projects (id, project_code, project_slug, client_name, client_email, created_at, folder_path, location, password, base_price, travel_surcharge, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, projectCode, finalSlug, clientName, "N/A", date, "/", finalLocation, projectPassword || null, basePrice || 0, travelSurcharge || 0, notes || null).run();

        const inserted = await d1.prepare("SELECT * FROM Projects WHERE project_code = ?").bind(projectCode).first();

        return NextResponse.json({
            id: inserted?.id,
            client: inserted?.client_name,
            code: inserted?.project_code,
            slug: inserted?.project_slug,
            date: inserted?.created_at
        });
    } catch (e) {
        console.error("Failed to create project", e);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const d1 = getRequestContext().env.shotbyhamadi_db;

        // Delete the project
        await d1.prepare("DELETE FROM Projects WHERE id = ?").bind(id).run();

        // Optionally, delete associated Media records as a cleanup measure
        await d1.prepare("DELETE FROM Media WHERE project_id = ?").bind(id).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
