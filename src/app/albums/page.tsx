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
    view_count: number;
    like_count: number;
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
        <div className="min-h-screen text-white pt-24 px-6 md:px-12 pb-24 selection:bg-[#8b5cf6]/30 selection:text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 md:mb-24 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-[var(--font-outfit)] font-light tracking-[0.2em] uppercase mb-4 gradient-text">Albums</h1>
                    <p className="text-zinc-400 text-sm md:text-base tracking-widest uppercase max-w-2xl">
                        Recent postings, sessions, and visual stories.
                    </p>
                </header>

                {albums.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 uppercase tracking-widest text-xs glass rounded-xl">
                        No albums published yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {albums.map(album => (
                            <Link key={album.id} href={`/albums/${album.slug}`} className="group block">
                                <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-lg border border-white/[0.06] glow-border">
                                    {album.cover_image_url || album.fallback_cover ? (
                                        <Image
                                            src={(album.cover_image_url || album.fallback_cover!).startsWith('http') ? (album.cover_image_url || album.fallback_cover!) : `/api/preview?key=${encodeURIComponent(album.cover_image_url || album.fallback_cover!)}`}
                                            alt={album.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs tracking-widest uppercase group-hover:text-zinc-500 transition-colors bg-white/[0.02]">
                                            No Cover
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl md:text-2xl font-light tracking-wide mb-2 group-hover:text-[#a78bfa] transition-colors">{album.title}</h2>
                                <div className="flex items-center gap-4 mb-3">
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">{album.date}</p>
                                    <div className="flex items-center gap-3 text-zinc-600 text-[11px]">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {album.view_count || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                            {album.like_count || 0}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-400 line-clamp-2">{album.description}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
