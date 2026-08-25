"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { resourceCategories as defaultCategories, ResourceCategory } from "./data";

// ─── Passphrase gate ──────────────────────────────────────────────────────────
const RESOURCES_PASSWORDS = [
    "shotbyhamadi-theonlyhamadi",
    "thenationofSBH123",
];
const SESSION_KEY = "sbh_resources_auth";
const STORAGE_KEY = "sbh_resources_data";

// ─── Persistence helpers (localStorage) ───────────────────────────────────────
function loadStoredCategories(): ResourceCategory[] | null {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return null;
}

function saveCategories(categories: ResourceCategory[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

// ─── Password Gate ────────────────────────────────────────────────────────────
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
        <div className="min-h-screen flex items-center justify-center p-6 font-sans">
            <div
                className={`w-full max-w-sm glass rounded-xl p-8 shadow-2xl shadow-black/50 transition-transform ${
                    shaking ? "animate-shake" : ""
                }`}
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h1 className="text-xl font-[var(--font-outfit)] font-light tracking-[0.2em] uppercase text-white mb-2">
                        External Resources
                    </h1>
                    <p className="text-zinc-500 text-[9px] tracking-[0.4em] uppercase">
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
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-center text-xs tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-[#8b5cf6]/50 transition-all duration-300"
                    />

                    {error && (
                        <p className="text-red-400 text-[10px] uppercase tracking-widest text-center font-bold">
                            Incorrect passphrase. Access denied.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full btn-gradient py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg"
                    >
                        Unlock
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-zinc-600 hover:text-zinc-400 text-[10px] uppercase tracking-widest transition-colors"
                    >
                        ← Back to Site
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Security helper ──────────────────────────────────────────────────────────
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
function ResourceLink({ url, index, onRemove }: { url: string; index: number; onRemove?: () => void }) {
    const safe = isSafeUrl(url);
    const hostname = getHostname(url);
    if (!safe) return null;

    return (
        <div className="group/link flex items-center justify-between w-full px-4 py-3 border border-transparent hover:border-white/[0.06] hover:bg-white/[0.02] transition-all duration-200 rounded-lg">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 min-w-0 flex-1"
            >
                <span className="text-[#8b5cf6] text-xs flex-shrink-0 group-hover/link:text-[#a78bfa] transition-colors">↗</span>
                <div className="min-w-0">
                    <p className="text-sm text-white group-hover/link:text-[#a78bfa] transition-colors duration-200 truncate">
                        Destination {index + 1}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">{hostname}</p>
                </div>
            </a>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="opacity-0 group-hover/link:opacity-100 text-red-500/60 hover:text-red-400 transition-all ml-2 p-1.5 hover:bg-red-500/10 rounded-lg"
                    title="Remove resource"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// ─── ResourceCategoryCard ─────────────────────────────────────────────────────
const INITIAL_SHOW = 3;

function ResourceCategoryCard({ category, forceExpanded, onRemoveUrl, onRemoveCategory, onAddUrl }: {
    category: ResourceCategory;
    forceExpanded: boolean;
    onRemoveUrl?: (url: string) => void;
    onRemoveCategory?: () => void;
    onAddUrl?: (url: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [showAddInput, setShowAddInput] = useState(false);
    const [newUrl, setNewUrl] = useState("");

    const safeUrls = useMemo(() => category.urls.filter(isSafeUrl), [category.urls]);
    const showToggle = safeUrls.length > INITIAL_SHOW;
    const isExpanded = forceExpanded || expanded;
    const visibleUrls = isExpanded ? safeUrls : safeUrls.slice(0, INITIAL_SHOW);

    const handleToggle = useCallback(() => setExpanded((prev) => !prev), []);

    return (
        <div className="glass rounded-xl flex flex-col transition-all duration-300 glow-border overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-white/[0.06]">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 min-w-0">
                        <span className="text-3xl leading-none flex-shrink-0 mt-0.5" role="img" aria-label={category.name}>
                            {category.icon}
                        </span>
                        <div className="min-w-0">
                            <h2 className="text-base font-medium tracking-wide text-white mb-1">{category.name}</h2>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">
                                {safeUrls.length} destination{safeUrls.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-xs text-zinc-400 mt-2">{category.description}</p>
                        </div>
                    </div>
                    {onRemoveCategory && (
                        <button
                            onClick={onRemoveCategory}
                            className="text-red-500/50 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg flex-shrink-0 ml-2"
                            title="Remove category"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Destinations */}
            <div className="flex-1 p-3">
                {safeUrls.length === 0 ? (
                    <p className="text-xs text-zinc-600 uppercase tracking-widest text-center py-4">
                        No destinations available.
                    </p>
                ) : (
                    <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isExpanded ? `${safeUrls.length * 64 + 60}px` : `${INITIAL_SHOW * 64 + 60}px` }}>
                        {visibleUrls.map((url, idx) => (
                            <ResourceLink key={url} url={url} index={idx} onRemove={onRemoveUrl ? () => onRemoveUrl(url) : undefined} />
                        ))}
                    </div>
                )}

                {/* Add Resource Input */}
                {onAddUrl && (
                    <div className="px-2 pt-2">
                        {showAddInput ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (newUrl.trim() && isSafeUrl(newUrl.trim())) {
                                    onAddUrl(newUrl.trim());
                                    setNewUrl("");
                                    setShowAddInput(false);
                                }
                            }} className="flex gap-2">
                                <input
                                    type="url"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="https://..."
                                    autoFocus
                                    className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b5cf6]/50"
                                />
                                <button type="submit" className="btn-gradient px-4 py-2 text-[10px] rounded-lg font-bold uppercase tracking-wider">Add</button>
                                <button type="button" onClick={() => setShowAddInput(false)} className="text-zinc-500 hover:text-white px-2 text-xs">✕</button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowAddInput(true)}
                                className="w-full text-center text-xs text-[#8b5cf6] hover:text-[#a78bfa] uppercase tracking-widest py-2 border border-dashed border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 transition-all duration-200 rounded-lg mt-1"
                            >
                                + Add Resource
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Expand / Collapse */}
            {showToggle && !forceExpanded && (
                <div className="px-4 pb-4">
                    <button
                        onClick={handleToggle}
                        className="w-full text-center text-xs text-[#8b5cf6] hover:text-[#a78bfa] uppercase tracking-widest py-2 border border-white/[0.06] hover:border-[#8b5cf6]/30 transition-all duration-200 rounded-lg"
                    >
                        {expanded ? "Show less ↑" : `Show all (${safeUrls.length}) ↓`}
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── ResourceSearch ───────────────────────────────────────────────────────────
function ResourceSearch({ value, onChange, totalResources, totalCategories }: {
    value: string;
    onChange: (value: string) => void;
    totalResources: number;
    totalCategories: number;
}) {
    return (
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10">
            <div className="flex gap-4">
                <div className="glass rounded-xl px-5 py-3 text-center min-w-[100px]">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Resources</p>
                    <p className="text-2xl font-light gradient-text">{totalResources}</p>
                </div>
                <div className="glass rounded-xl px-5 py-3 text-center min-w-[100px]">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Categories</p>
                    <p className="text-2xl font-light gradient-text">{totalCategories}</p>
                </div>
            </div>
            <div className="relative w-full md:w-auto md:min-w-[360px]">
                <input
                    id="resource-search"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search resources or destinations..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors duration-200 pr-10"
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

// ─── Add Category Modal ───────────────────────────────────────────────────────
function AddCategoryModal({ onAdd, onClose }: { onAdd: (cat: ResourceCategory) => void; onClose: () => void }) {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("📁");
    const [description, setDescription] = useState("");

    const emojis = ["📁", "⚡", "🌐", "🔥", "💎", "🚀", "🎯", "🌌", "💧", "🌿", "🔷", "🐇", "✦", "🎭", "🛡️", "🔒"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="glass border-white/10 rounded-xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-lg font-[var(--font-outfit)] font-light tracking-[0.15em] uppercase mb-6">Add Category</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!name.trim()) return;
                    onAdd({
                        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        name: name.trim(),
                        icon,
                        description: description.trim() || `Available ${name.trim()} destinations`,
                        urls: [],
                    });
                    onClose();
                }} className="space-y-5">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Icon</label>
                        <div className="flex flex-wrap gap-2">
                            {emojis.map(e => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => setIcon(e)}
                                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${icon === e ? "bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 scale-110" : "bg-white/[0.03] border border-white/[0.06] hover:border-white/20"}`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Category Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. My Service" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b5cf6]/50" />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Description</label>
                        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b5cf6]/50" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 btn-gradient py-3 text-xs font-bold uppercase tracking-widest rounded-lg">Create</button>
                        <button type="button" onClick={onClose} className="flex-1 glass py-3 text-xs uppercase tracking-widest rounded-lg text-zinc-400 hover:text-white transition-colors">Cancel</button>
                    </div>
                </form>
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
    const [showAddCategory, setShowAddCategory] = useState(false);

    // Load categories from localStorage or fall back to defaults
    const [categories, setCategories] = useState<ResourceCategory[]>(() => {
        return loadStoredCategories() || defaultCategories;
    });

    // Persist on change
    const updateCategories = useCallback((newCats: ResourceCategory[]) => {
        setCategories(newCats);
        saveCategories(newCats);
    }, []);

    const totalResources = useMemo(
        () => categories.reduce((acc, cat) => acc + cat.urls.filter(isSafeUrl).length, 0),
        [categories]
    );

    const filteredCategories = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return categories
            .filter((cat) => {
                if (activeFilter !== "all" && cat.id !== activeFilter) return false;
                if (!q) return true;
                const nameMatch = cat.name.toLowerCase().includes(q);
                const descMatch = cat.description.toLowerCase().includes(q);
                const urlMatch = cat.urls.some((url) =>
                    getHostname(url).toLowerCase().includes(q) || url.toLowerCase().includes(q)
                );
                return nameMatch || descMatch || urlMatch;
            })
            .map((cat) => {
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
    }, [searchQuery, activeFilter, categories]);

    const isSearching = searchQuery.trim().length > 0;

    // Management handlers
    const handleAddUrl = useCallback((categoryId: string, url: string) => {
        updateCategories(categories.map(cat =>
            cat.id === categoryId ? { ...cat, urls: [...cat.urls, url] } : cat
        ));
    }, [categories, updateCategories]);

    const handleRemoveUrl = useCallback((categoryId: string, url: string) => {
        updateCategories(categories.map(cat =>
            cat.id === categoryId ? { ...cat, urls: cat.urls.filter(u => u !== url) } : cat
        ));
    }, [categories, updateCategories]);

    const handleRemoveCategory = useCallback((categoryId: string) => {
        if (!confirm("Remove this category and all its resources?")) return;
        updateCategories(categories.filter(cat => cat.id !== categoryId));
        if (activeFilter === categoryId) setActiveFilter("all");
    }, [categories, updateCategories, activeFilter]);

    const handleAddCategory = useCallback((cat: ResourceCategory) => {
        updateCategories([...categories, cat]);
    }, [categories, updateCategories]);

    if (!unlocked) {
        return <ResourcePasswordGate onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <div className="min-h-screen text-white selection:bg-[#8b5cf6]/30 selection:text-white font-sans">
            <div className="max-w-6xl mx-auto px-4 md:px-10 pt-10 pb-24 w-full">

                {/* Back Link */}
                <div className="mb-10">
                    <Link href="/" className="text-xs text-zinc-500 hover:text-[#a78bfa] transition-colors uppercase tracking-widest flex items-center gap-2 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Site
                    </Link>
                </div>

                {/* Page Header */}
                <header className="mb-12 border-b border-white/[0.06] pb-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4">
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl">🌐</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-[var(--font-outfit)] font-light tracking-[0.15em] uppercase text-white mb-2 gradient-text">
                                    External Resources
                                </h1>
                                <p className="text-zinc-400 text-sm">
                                    Choose a service and open one of its available destinations.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddCategory(true)}
                            className="btn-gradient px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Category
                        </button>
                    </div>
                </header>

                {/* Search + Stats */}
                <ResourceSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    totalResources={totalResources}
                    totalCategories={categories.length}
                />

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-2 items-center">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-4 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 rounded-lg ${activeFilter === "all"
                            ? "bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/30"
                            : "text-zinc-500 border border-white/[0.06] hover:text-white hover:border-white/20"
                            }`}
                    >
                        All Resources
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(activeFilter === cat.id ? "all" : cat.id)}
                            className={`px-4 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 rounded-lg flex items-center gap-2 ${activeFilter === cat.id
                                ? "bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/30"
                                : "text-zinc-500 border border-white/[0.06] hover:text-white hover:border-white/20"
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredCategories.length === 0 ? (
                    <div className="glass rounded-xl py-20 text-center">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest">No matching resources found.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                            className="mt-6 text-xs text-[#8b5cf6] hover:text-[#a78bfa] uppercase tracking-widest transition-colors"
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
                                    onRemoveUrl={(url) => handleRemoveUrl(cat.id, url)}
                                />
                            ) : (
                                <ResourceCategoryCard
                                    key={cat.id}
                                    category={cat}
                                    forceExpanded={false}
                                    onRemoveUrl={(url) => handleRemoveUrl(cat.id, url)}
                                    onRemoveCategory={() => handleRemoveCategory(cat.id)}
                                    onAddUrl={(url) => handleAddUrl(cat.id, url)}
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Add Category Modal */}
            {showAddCategory && (
                <AddCategoryModal
                    onAdd={handleAddCategory}
                    onClose={() => setShowAddCategory(false)}
                />
            )}
        </div>
    );
}

// ─── SearchResultCard ──────────────────────────────────────────────────────────
function SearchResultCard({ category, matchedUrls, onRemoveUrl }: {
    category: ResourceCategory;
    matchedUrls: string[];
    onRemoveUrl?: (url: string) => void;
}) {
    const safeUrls = matchedUrls.filter(isSafeUrl);

    return (
        <div className="glass rounded-xl flex flex-col transition-all duration-300 glow-border overflow-hidden">
            <div className="p-6 border-b border-white/[0.06]">
                <div className="flex items-start gap-4">
                    <span className="text-3xl leading-none flex-shrink-0 mt-0.5" role="img" aria-label={category.name}>
                        {category.icon}
                    </span>
                    <div className="min-w-0">
                        <h2 className="text-base font-medium tracking-wide text-white mb-1">{category.name}</h2>
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
                        No destinations available.
                    </p>
                ) : (
                    safeUrls.map((url, idx) => (
                        <ResourceLink key={url} url={url} index={idx} onRemove={onRemoveUrl ? () => onRemoveUrl(url) : undefined} />
                    ))
                )}
            </div>
        </div>
    );
}
