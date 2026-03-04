import { getRequestContext } from "@cloudflare/next-on-pages";
import Link from "next/link";
import Image from "next/image";

export const runtime = "edge";

interface Album {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image_url?: string;
    date: string;
}

export default async function AlbumsPage() {
    const d1 = getRequestContext().env.shotbyhamadi_db;
    const query = `
        SELECT Albums.*, 
               (SELECT url FROM Media WHERE album_id = Albums.id ORDER BY created_at ASC LIMIT 1) as fallback_cover
        FROM Albums 
        WHERE is_published = 1 
        ORDER BY created_at DESC
    `;
    const { results } = await d1.prepare(query).all();
    const albums = results as unknown as (Album & { fallback_cover: string | null })[];

    return (
        <div className="min-h-screen bg-[#000000] text-white pt-24 px-6 md:px-12 pb-24 selection:bg-[#A1A1AA] selection:text-black">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 md:mb-24 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-4">Albums</h1>
                    <p className="text-zinc-400 text-sm md:text-base tracking-widest uppercase max-w-2xl">
                        Recent postings, sessions, and visual stories.
                    </p>
                </header>

                {albums.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 uppercase tracking-widest text-xs">
                        No albums published yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {albums.map(album => (
                            <Link key={album.id} href={`/albums/${album.slug}`} className="group block">
                                <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-zinc-900 border border-zinc-900/50">
                                    {album.cover_image_url || album.fallback_cover ? (
                                        <Image
                                            src={(album.cover_image_url || album.fallback_cover!).startsWith('http') ? (album.cover_image_url || album.fallback_cover!) : `/api/preview?key=${encodeURIComponent(album.cover_image_url || album.fallback_cover!)}`}
                                            alt={album.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-xs tracking-widest uppercase group-hover:text-zinc-600 transition-colors">
                                            No Cover
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl md:text-2xl font-light tracking-wide mb-2 group-hover:text-[#A1A1AA] transition-colors">{album.title}</h2>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-mono">{album.date}</p>
                                <p className="text-sm text-zinc-400 line-clamp-2">{album.description}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
