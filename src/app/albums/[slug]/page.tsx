import { getRequestContext } from "@cloudflare/next-on-pages";
import { notFound } from "next/navigation";
import Link from "next/link";

export const runtime = "edge";

interface Album {
    id: number;
    title: string;
    slug: string;
    description: string;
    date: string;
}

interface MediaItem {
    id: number;
    url: string;
    alt_text: string;
}

export default async function AlbumView({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const d1 = getRequestContext().env.shotbyhamadi_db;

    const albumRes = await d1.prepare("SELECT * FROM Albums WHERE slug = ? AND is_published = 1").bind(slug).first();
    if (!albumRes) {
        notFound();
    }
    const album = albumRes as unknown as Album;

    const mediaRes = await d1.prepare("SELECT * FROM Media WHERE album_id = ? ORDER BY created_at ASC").bind(album.id).all();
    const images = mediaRes.results as unknown as MediaItem[];

    return (
        <div className="min-h-screen bg-[#000000] text-white pt-24 px-4 md:px-10 pb-24 selection:bg-[#A1A1AA] selection:text-black font-sans">
            <Link href="/albums" className="inline-block mb-12 text-xs text-zinc-500 hover:text-[#A1A1AA] transition-colors uppercase tracking-widest border-b border-transparent hover:border-[#A1A1AA] pb-1">
                ← Back to Albums
            </Link>

            <header className="mb-16 md:mb-24 max-w-4xl">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-light tracking-wide mb-6">{album.title}</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs tracking-widest uppercase text-zinc-500 mb-8 font-mono">
                    <span>{album.date}</span>
                </div>
                {album.description && (
                    <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-3xl">
                        {album.description}
                    </p>
                )}
            </header>

            {images.length === 0 ? (
                <div className="py-20 text-zinc-600 tracking-widest text-xs uppercase text-center border border-zinc-900">
                    No images yet for this album.
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map(img => {
                        const srcUrl = img.url.startsWith('http') ? img.url : `/api/preview?key=${encodeURIComponent(img.url)}`;
                        return (
                            <div key={img.id} className="break-inside-avoid relative group overflow-hidden bg-zinc-900 border border-zinc-900/50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={srcUrl}
                                    alt={img.alt_text || "Album Photo"}
                                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                    loading="lazy"
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
