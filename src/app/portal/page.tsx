"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchResult = {
    project_slug: string;
    client_name: string;
    location: string;
};

export default function PortalLoginPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const debounceTimer = useRef<NodeJS.Timeout>(undefined); // Allow TS to infer Timeout

    useEffect(() => {
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setIsSearching(true);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/portal/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json() as SearchResult[];
                    setResults(data);
                    if (data.length === 0) {
                        setError("No galleries found");
                    } else {
                        setError("");
                    }
                } else {
                    setResults([]);
                    setError("Search failed");
                }
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [searchQuery]);

    const handleSelect = (slug: string) => {
        router.push(`/portal/${slug}`);
    };

    const handleAccess = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback: If they hit enter, and there's an exact/first match, route to it.
        if (results.length > 0) {
            router.push(`/portal/${results[0].project_slug}`);
        } else if (searchQuery.trim().length > 0) {
            setError("No matching gallery found.");
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 selection:bg-[#A1A1AA] selection:text-black font-sans relative">
            <Link href="/" className="absolute top-10 left-10 text-xs text-zinc-500 hover:text-[#A1A1AA] transition-colors uppercase tracking-widest">
                ← Back to site
            </Link>

            <div className="w-full max-w-md border border-zinc-900 p-10 shadow-2xl shadow-black/50 animate-fade-in bg-zinc-900/10 relative">
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-white mb-2">Client Portal</h1>
                    <p className="text-[#A1A1AA] text-[9px] tracking-[0.4em] uppercase">Private Gallery Access</p>
                </div>

                <form onSubmit={handleAccess} className="space-y-4 relative">
                    <div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (e.target.value.length < 2) setError("");
                            }}
                            placeholder="ENTER PROJECT/CLIENT NAME"
                            required
                            autoComplete="off"
                            className="w-full bg-transparent border-b border-zinc-900 px-4 py-3 text-center text-xs tracking-widest text-white placeholder-zinc-800 focus:outline-none focus:border-[#A1A1AA] transition-all duration-300 uppercase"
                        />
                    </div>

                    {/* Auto-Complete Dropdown */}
                    {results.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-[#000000] border border-zinc-800 shadow-2xl z-50 animate-fade-in max-h-64 overflow-y-auto">
                            {results.map((result) => (
                                <button
                                    key={result.project_slug}
                                    type="button"
                                    onClick={() => handleSelect(result.project_slug)}
                                    className="w-full text-left px-4 py-4 border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors group flex flex-col items-center justify-center"
                                >
                                    <span className="text-white text-xs uppercase tracking-[0.2em] group-hover:text-[#A1A1AA] transition-colors mb-1">
                                        {result.client_name}
                                    </span>
                                    <span className="text-zinc-600 text-[9px] uppercase tracking-widest">
                                        {result.location || "United States"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {error && !isSearching && (
                        <p className="text-red-500 text-[10px] uppercase tracking-widest text-center mt-4 font-bold animate-pulse">
                            {error}
                        </p>
                    )}

                    {/* Hidden submit so Enter key works with form */}
                    <button type="submit" className="hidden">Access</button>

                    <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest pt-8">
                        Can&apos;t find your gallery? <a href="mailto:contact@shotbyhamadi.com" className="hover:text-[#A1A1AA] transition-colors border-b border-transparent hover:border-[#A1A1AA]">Contact Studio</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
