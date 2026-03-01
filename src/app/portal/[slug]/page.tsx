import { getRequestContext } from "@cloudflare/next-on-pages";
import { notFound } from "next/navigation";
import PortalClientView from "./PortalClientView";

export const runtime = "edge";

type MediaItem = {
    id: number;
    url: string;
    alt_text: string | null;
    project_id: string | null;
    category_id: number | null;
    created_at: string;
    is_public: number;
    client_status: string;
};

export default async function PortalGallery({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const d1 = getRequestContext().env.shotbyhamadi_db;

    // Find project by slug
    const projectRes = await d1.prepare("SELECT * FROM Projects WHERE project_slug = ?").bind(slug).first();

    if (!projectRes) {
        notFound();
    }

    // Find images for this project
    const mediaRes = await d1.prepare("SELECT * FROM Media WHERE project_id = ? ORDER BY created_at DESC").bind(projectRes.id).all();
    const images = mediaRes.results as MediaItem[];

    return (
        <PortalClientView
            project={{
                name: projectRes.client_name as string,
                date: projectRes.created_at as string,
                location: projectRes.location as string || "United States",
                slug: projectRes.project_slug as string,
                password: projectRes.project_password as string | null,
                basePrice: projectRes.base_price as number || 0,
                travelSurcharge: projectRes.travel_surcharge as number || 0
            }}
            images={images}
        />
    );
}
