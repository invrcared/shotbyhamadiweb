"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { resourceCategories, ResourceCategory } from "./data";

// ─── Secondary passphrase gate ────────────────────────────────────────────────
// The page is already behind NextAuth. This is an extra layer for the resources
// section specifically. Change the value below to update the passphrase.
const RESOURCES_PASSWORDS = [
    "shotbyhamadi-theonlyhamadi",
    "thenationofSBH123",
];
const SESSION_KEY = "sbh_resources_auth";

function ResourcePasswordGate({ onUnlock }: { onUnlock: () => void }) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [shaking, setShaking] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (RESOURCES_PASSWORDS.includes(input)) {
            sessionStorage.setItem(SESSION_KEY, "1");
            onUnlock();
        } else {
            setError(true);
            setShaking(true);
            setInput("");
            setTimeout(() => setShaking(false), 500);
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 selection:bg-[#A1A1AA] selection:text-black font-sans">
            <div
                className={`w-full max-w-sm border border-zinc-900 p-8 shadow-2xl shadow-black/50 transition-transform ${
                    shaking ? "animate-[shake_0.4s_ease]" : ""
                }`}
            >
                <div className="text-center mb-10">
                    <div className="text-4xl mb-4">🌐</div>
                    <h1 className="text-xl font-light tracking-[0.3em] uppercase text-white mb-2">
                        External Resources
                    </h1>
                    <p className="text-[#A1A1AA] text-[9px] tracking-[0.4em] uppercase">
                        Enter access passphrase
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        id="resources-passphrase"
                        type="password"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(false); }}
                        placeholder="PASSPHRASE"
                        autoFocus
                        required
                        className="w-full bg-transparent border-b border-zinc-900 px-4 py-3 text-center text-xs tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-[#A1A1AA] transition-all duration-300"
                    />

                    {error && (
                        <p className="text-red-500 text-[10px] uppercase tracking-widest text-center font-bold">
                            Incorrect passphrase. Access denied.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#A1A1AA] text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 shadow-lg"
                    >
                        Unlock
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link
                        href="/admin"
                        className="text-zinc-600 hover:text-zinc-400 text-[10px] uppercase tracking-widest transition-colors"
                    >
                        ← Back to Admin
                    </Link>
                </div>
            </div>

            {/* Shake animation */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
            `}</style>
        </div>
    );
}

// ─── Security helper ──────────────────────────────────────────────────────────
/** Only allow http:// and https:// protocols. Rejects javascript:, data:, file:, etc. */
function isSafeUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
}

function getHostname(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
}

// ─── ResourceLink ─────────────────────────────────────────────────────────────
interface ResourceLinkProps {
    url: string;
    index: number;
}

function ResourceLink({ url, index }: ResourceLinkProps) {
    const safe = isSafeUrl(url);
    const hostname = getHostname(url);

    if (!safe) return null;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex items-center justify-between w-full px-4 py-3 border border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-200 rounded-sm cursor-pointer"
        >
            <div className="flex items-center gap-3 min-w-0">
                <span className="text-[#3B82F6] text-xs flex-shrink-0 group-hover/link:text-blue-400 transition-colors">↗</span>
                <div className="min-w-0">
                    <p className="text-sm text-white group-hover/link:text-[#3B82F6] transition-colors duration-200 truncate">
                        Destination {index + 1}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">{hostname}</p>
                </div>
            </div>
        </a>
    );
}

// ─── ResourceCategoryCard ─────────────────────────────────────────────────────
const INITIAL_SHOW = 3;

interface ResourceCategoryCardProps {
    category: ResourceCategory;
    forceExpanded: boolean;
}

function ResourceCategoryCard({ category, forceExpanded }: ResourceCategoryCardProps) {
    const [expanded, setExpanded] = useState(false);

    const safeUrls = useMemo(
        () => category.urls.filter(isSafeUrl),
        [category.urls]
    );

    const showToggle = safeUrls.length > INITIAL_SHOW;
    const isExpanded = forceExpanded || expanded;
    const visibleUrls = isExpanded ? safeUrls : safeUrls.slice(0, INITIAL_SHOW);

    const handleToggle = useCallback(() => {
        setExpanded((prev) => !prev);
    }, []);

    return (
        <div className="border border-zinc-900 bg-[#000000] flex flex-col transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/50">
            {/* Card Header */}
            <div className="p-6 border-b border-zinc-900/60">
                <div className="flex items-start gap-4">
                    <span className="text-3xl leading-none flex-shrink-0 mt-0.5" role="img" aria-label={category.name}>
                        {category.icon}
                    </span>
                    <div className="min-w-0">
                        <h2 className="text-base font-medium tracking-wide text-white mb-1">
                            {category.name}
                        </h2>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">
                            {safeUrls.length} available destination{safeUrls.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-zinc-400 mt-2">{category.description}</p>
                    </div>
                </div>
            </div>

            {/* Destinations */}
            <div className="flex-1 p-3">
                {safeUrls.length === 0 ? (
                    <p className="text-xs text-zinc-600 uppercase tracking-widest text-center py-4">
                        No destinations are currently available.
                    </p>
                ) : (
                    <div
                        className="overflow-hidden transition-all duration-300"
                        style={{ maxHeight: isExpanded ? `${safeUrls.length * 64}px` : `${INITIAL_SHOW * 64}px` }}
                    >
                        {visibleUrls.map((url, idx) => (
                            <ResourceLink key={url} url={url} index={idx} />
                        ))}
                    </div>
                )}
            </div>

            {/* Expand / Collapse */}
            {showToggle && !forceExpanded && (
                <div className="px-4 pb-4">
                    <button
                        onClick={handleToggle}
                        className="w-full text-center text-xs text-[#3B82F6] hover:text-blue-400 uppercase tracking-widest py-2 border border-zinc-900 hover:border-zinc-700 transition-all duration-200"
                    >
                        {expanded
                            ? "Show less ↑"
                            : `Show all (${safeUrls.length}) ↓`}
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── ResourceSearch ───────────────────────────────────────────────────────────
interface ResourceSearchProps {
    value: string;
    onChange: (value: string) => void;
    totalResources: number;
    totalCategories: number;
}

function ResourceSearch({ value, onChange, totalResources, totalCategories }: ResourceSearchProps) {
    return (
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10">
            <div className="flex gap-6">
                <div className="border border-zinc-900 px-5 py-3 bg-[#000000] text-center min-w-[100px]">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Resources</p>
                    <p className="text-2xl font-light">{totalResources}</p>
                </div>
                <div className="border border-zinc-900 px-5 py-3 bg-[#000000] text-center min-w-[100px]">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Categories</p>
                    <p className="text-2xl font-light">{totalCategories}</p>
                </div>
            </div>
            <div className="relative w-full md:w-auto md:min-w-[360px]">
                <input
                    id="resource-search"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search resources or destinations..."
                    className="w-full bg-[#000000] border border-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1A1AA] transition-colors duration-200 pr-10"
                />
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors text-lg leading-none"
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── ResourceDashboard (main page) ────────────────────────────────────────────
export default function ResourceDashboard() {
    const [unlocked, setUnlocked] = useState(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem(SESSION_KEY) === "1";
        }
        return false;
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const totalResources = useMemo(
        () => resourceCategories.reduce((acc, cat) => acc + cat.urls.filter(isSafeUrl).length, 0),
        []
    );

    // Filter categories based on search and active filter
    const filteredCategories = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();

        return resourceCategories
            .filter((cat) => {
                // Category filter
                if (activeFilter !== "all" && cat.id !== activeFilter) return false;

                // Search filter
                if (!q) return true;

                const nameMatch = cat.name.toLowerCase().includes(q);
                const descMatch = cat.description.toLowerCase().includes(q);
                const urlMatch = cat.urls.some((url) =>
                    getHostname(url).toLowerCase().includes(q) || url.toLowerCase().includes(q)
                );
                return nameMatch || descMatch || urlMatch;
            })
            .map((cat) => {
                // When searching, return category with only matching urls
                if (!q) return { cat, matchedUrls: null };

                const matchedUrls = cat.urls.filter(
                    (url) =>
                        cat.name.toLowerCase().includes(q) ||
                        cat.description.toLowerCase().includes(q) ||
                        getHostname(url).toLowerCase().includes(q) ||
                        url.toLowerCase().includes(q)
                );
                return { cat, matchedUrls };
            });
    }, [searchQuery, activeFilter]);

    const isSearching = searchQuery.trim().length > 0;

    if (!unlocked) {
        return <ResourcePasswordGate onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#A1A1AA] selection:text-black font-sans">
            <div className="max-w-6xl mx-auto px-4 md:px-10 pt-10 pb-24 w-full">

                {/* Back Link */}
                <div className="mb-10">
                    <Link
                        href="/admin"
                        className="text-xs text-zinc-500 hover:text-[#A1A1AA] transition-colors uppercase tracking-widest flex items-center gap-2"
                    >
                        ← Back to Admin
                    </Link>
                </div>

                {/* Page Header */}
                <header className="mb-12 border-b border-zinc-900 pb-10">
                    <div className="flex items-start gap-5 mb-4">
                        <span className="text-4xl leading-none mt-1" role="img" aria-label="Globe">🌐</span>
                        <div>
                            <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-white mb-2">
                                External Resources
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                Choose a service and open one of its available destinations.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Search + Stats */}
                <ResourceSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    totalResources={totalResources}
                    totalCategories={resourceCategories.length}
                />

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-2 items-center">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-200 border ${activeFilter === "all"
                            ? "bg-zinc-900 text-white border-zinc-700"
                            : "text-zinc-500 border-zinc-900 hover:text-white hover:border-zinc-700"
                            }`}
                    >
                        All Resources
                    </button>
                    {resourceCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(activeFilter === cat.id ? "all" : cat.id)}
                            className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-200 border flex items-center gap-2 ${activeFilter === cat.id
                                ? "bg-zinc-900 text-white border-zinc-700"
                                : "text-zinc-500 border-zinc-900 hover:text-white hover:border-zinc-700"
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredCategories.length === 0 ? (
                    <div className="border border-zinc-900 py-20 text-center">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest">No matching resources found.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                            className="mt-6 text-xs text-[#3B82F6] hover:text-blue-400 uppercase tracking-widest transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCategories.map(({ cat, matchedUrls }) =>
                            isSearching && matchedUrls !== null ? (
                                <SearchResultCard
                                    key={cat.id}
                                    category={cat}
                                    matchedUrls={matchedUrls}
                                />
                            ) : (
                                <ResourceCategoryCard
                                    key={cat.id}
                                    category={cat}
                                    forceExpanded={false}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── SearchResultCard (special card when searching - shows matched urls) ───────
interface SearchResultCardProps {
    category: ResourceCategory;
    matchedUrls: string[];
}

function SearchResultCard({ category, matchedUrls }: SearchResultCardProps) {
    const safeUrls = matchedUrls.filter(isSafeUrl);

    return (
        <div className="border border-zinc-800 bg-[#000000] flex flex-col transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/50">
            <div className="p-6 border-b border-zinc-900/60">
                <div className="flex items-start gap-4">
                    <span className="text-3xl leading-none flex-shrink-0 mt-0.5" role="img" aria-label={category.name}>
                        {category.icon}
                    </span>
                    <div className="min-w-0">
                        <h2 className="text-base font-medium tracking-wide text-white mb-1">
                            {category.name}
                        </h2>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">
                            {safeUrls.length} match{safeUrls.length !== 1 ? "es" : ""}
                        </p>
                        <p className="text-xs text-zinc-400 mt-2">{category.description}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-3">
                {safeUrls.length === 0 ? (
                    <p className="text-xs text-zinc-600 uppercase tracking-widest text-center py-4">
                        No destinations are currently available.
                    </p>
                ) : (
                    safeUrls.map((url, idx) => (
                        <ResourceLink key={url} url={url} index={idx} />
                    ))
                )}
            </div>
        </div>
    );
}
