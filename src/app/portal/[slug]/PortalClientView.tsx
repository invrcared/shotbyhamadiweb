"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

interface PortalClientViewProps {
    project: {
        name: string;
        date: string;
        location: string;
        slug: string;
        password: string | null;
        basePrice: number;
        travelSurcharge: number;
    };
    images: MediaItem[];
}

export default function PortalClientView({ project, images }: PortalClientViewProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [isGateOpen, setIsGateOpen] = useState(false);
    const [gateInput, setGateInput] = useState("");
    const [gateError, setGateError] = useState("");
    const [isChecking, setIsChecking] = useState(true);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Feedback System States
    const [localImages, setLocalImages] = useState<MediaItem[]>(images);
    const [activeFilter, setActiveFilter] = useState<"all" | "favorite" | "liked" | "disliked">("all");

    useEffect(() => {
        // Check local storage for existing session access
        const accessState = localStorage.getItem(`shotbyhamadi_access_${project.slug}`);
        setTimeout(() => {
            if (accessState === "granted") {
                setIsGateOpen(true);
            }
            setIsChecking(false);
        }, 0);
    }, [project.slug]);

    const handleGateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedInput = gateInput.trim().toLowerCase();
        const normalizedLocation = project.location.trim().toLowerCase();

        // Validation: Password match (if password exists) OR Location match
        if (
            (project.password && gateInput === project.password) ||
            (!project.password && normalizedInput.length > 2 && normalizedLocation.includes(normalizedInput)) ||
            (!project.password && normalizedInput === normalizedLocation)
        ) {
            setIsGateOpen(true);
            localStorage.setItem(`shotbyhamadi_access_${project.slug}`, "granted");
            setGateError("");
        } else {
            setGateError("Incorrect Verification. Please try again.");
        }
    };

    const handleDownload = async (url: string, e: React.MouseEvent, isBulk = false) => {
        if (!isBulk) {
            e.preventDefault();
            e.stopPropagation();
        }
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = `ShotByHamadi-${project.name.replace(/\s+/g, '-')}-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
            if (!isBulk) alert("Failed to download image. Try right-clicking and saving.");
        }
    };

    const handleDownloadAll = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const originalHTML = button.innerHTML;
        button.innerHTML = 'Downloading...';
        button.disabled = true;

        for (const img of filteredImages) {
            const actualUrl = img.url.startsWith('http') ? img.url : `/api/preview?key=${encodeURIComponent(img.url)}`;
            await handleDownload(actualUrl, e, true);
        }

        button.innerHTML = originalHTML;
        button.disabled = false;
    };

    const handleStatusChange = async (imageId: number, newStatus: string) => {
        const updatedImages = localImages.map(img =>
            img.id === imageId ? { ...img, client_status: img.client_status === newStatus ? 'none' : newStatus } : img
        );
        setLocalImages(updatedImages);

        try {
            await fetch('/api/media/status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: imageId,
                    status: updatedImages.find(i => i.id === imageId)?.client_status
                })
            });
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const filteredImages = localImages.filter(img => {
        if (activeFilter === "all") return true;
        return img.client_status === activeFilter;
    });

    if (isChecking) {
        return <div className="min-h-screen bg-black" />; // Blank screen while reading local storage
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#A1A1AA] selection:text-black flex flex-col relative">
            <header className="sticky top-0 z-50 w-full bg-[#000000]/80 backdrop-blur-md border-b border-zinc-900/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image src="/white-transparent.png" alt="ShotByHamadi Logo" width={150} height={40} className="object-contain" />
                    </Link>
                    <nav className="hidden md:flex gap-8 items-center text-xs tracking-widest uppercase text-zinc-500">
                        <Link href="/" className="hover:text-[#A1A1AA] transition-colors">Work</Link>
                        <Link href="/services" className="hover:text-[#A1A1AA] transition-colors">Services</Link>
                        <Link href="/portal" className="text-white">Portal</Link>
                        <Link href="/admin" className="hover:text-[#A1A1AA] transition-colors">Admin</Link>
                    </nav>
                </div>
            </header>

            {!isGateOpen ? (
                // --- GATEKEEPER UI --- //
                <main className="flex-grow flex flex-col items-center justify-center p-6 w-full animate-fade-in z-40 bg-black min-h-screen fixed inset-0">
                    <Link href="/" className="absolute top-10 left-10 text-xs text-zinc-500 hover:text-[#A1A1AA] transition-colors uppercase tracking-widest z-50">
                        ← Back to site
                    </Link>
                    <div className="w-full max-w-md border border-zinc-900 p-10 shadow-2xl shadow-black/50 bg-zinc-900/10">
                        <div className="text-center mb-12">
                            <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-white mb-2">{project.name}</h1>
                            <p className="text-[#A1A1AA] text-[9px] tracking-[0.4em] uppercase">Identity Verification</p>
                        </div>

                        <form onSubmit={handleGateSubmit} className="space-y-4 relative">
                            <div>
                                <input
                                    type={project.password ? "password" : "text"}
                                    value={gateInput}
                                    onChange={(e) => {
                                        setGateInput(e.target.value);
                                        setGateError("");
                                    }}
                                    placeholder={project.password ? "ENTER PROJECT PASSWORD" : "ENTER SHOOT LOCATION (CITY, STATE)"}
                                    required
                                    autoComplete="off"
                                    className="w-full bg-transparent border-b border-zinc-900 px-4 py-3 text-center text-xs tracking-widest text-white placeholder-zinc-800 focus:outline-none focus:border-[#A1A1AA] transition-all duration-300 uppercase"
                                />
                            </div>

                            {gateError && (
                                <p className="text-red-500 text-[10px] uppercase tracking-widest text-center mt-4 font-bold animate-pulse">
                                    {gateError}
                                </p>
                            )}

                            <button type="submit" className="hidden">Verify</button>

                            <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest pt-8">
                                Lost your key? <a href="mailto:contact@shotbyhamadi.com" className="hover:text-[#A1A1AA] transition-colors border-b border-transparent hover:border-[#A1A1AA]">Contact Studio</a>
                            </p>
                        </form>
                    </div>
                </main>
            ) : (
                // --- GALLERY SECURE VIEW --- //
                <main className="flex-grow flex flex-col items-center px-6 pt-16 pb-24 w-full max-w-7xl mx-auto">
                    <div className="w-full mb-16 flex flex-col items-center text-center animate-fade-in relative">
                        <div className="absolute top-0 left-0 group">
                            <Link href="/" className="flex items-center group">
                                <Image src="/white-transparent.png" alt="ShotByHamadi Logo" width={150} height={40} className="object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 group">
                            <button
                                onClick={() => {
                                    localStorage.removeItem(`shotbyhamadi_access_${project.slug}`);
                                    setIsGateOpen(false);
                                }}
                                className="text-zinc-600 text-[9px] uppercase tracking-widest hover:text-[#A1A1AA] transition-colors">
                                Logout
                            </button>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-4 text-white">
                            {project.name}
                        </h1>
                        <p className="text-[#A1A1AA] tracking-[0.3em] uppercase text-[10px] md:text-xs">
                            {project.location} • {new Date(project.date).toLocaleDateString()}
                        </p>
                        {(project.basePrice > 0 || project.travelSurcharge > 0) && (
                            <div className="mt-6 border border-zinc-900 bg-zinc-900/30 px-6 py-3 inline-block">
                                <p className="text-zinc-500 uppercase tracking-widest text-[9px] mb-1">Total Investment</p>
                                <p className="text-white tracking-[0.2em] uppercase text-sm md:text-base font-light">
                                    ${(project.basePrice + project.travelSurcharge).toFixed(2)}
                                </p>
                            </div>
                        )}

                        {/* Feedback Filters */}
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {(["all", "favorite", "liked", "disliked"] as const).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors border ${activeFilter === filter
                                        ? "border-[#A1A1AA] text-white bg-zinc-900/50"
                                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                                        }`}
                                >
                                    {filter} {filter !== "all" && `(${localImages.filter(i => i.client_status === filter).length})`}
                                </button>
                            ))}
                            {filteredImages.length > 0 && (
                                <button
                                    onClick={handleDownloadAll}
                                    className="px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors border border-green-900/50 text-green-500 hover:bg-green-900/20 ml-4"
                                >
                                    ↓ Download These {filteredImages.length}
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredImages.length === 0 ? (
                        <div className="w-full py-32 flex flex-col items-center justify-center border border-zinc-900/50 bg-[#000000] animate-fade-in shadow-xl">
                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] md:text-xs mb-4">Gallery Status</p>
                            <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-[#A1A1AA] uppercase px-4 text-center">
                                {activeFilter === "all" ? "Gallery Coming Soon" : `No ${activeFilter} images found`}
                            </h2>
                        </div>
                    ) : (
                        <div className="w-full columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 animate-fade-in">
                            {filteredImages.map((img) => {
                                const actualUrl = img.url.startsWith('http') ? img.url : `/api/preview?key=${encodeURIComponent(img.url)}`;
                                return (
                                    <div
                                        key={img.id}
                                        className="break-inside-avoid relative group overflow-hidden bg-[#27272A] mb-4 cursor-zoom-in"
                                        onClick={() => setLightboxImage(actualUrl)}
                                    >
                                        <Image
                                            src={actualUrl}
                                            alt={img.alt_text || "Client Image"}
                                            width={1000}
                                            height={600}
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-[#000000]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            )}

            <footer className="mt-10 w-full p-10 text-center border-t border-zinc-900/50 z-10">
                <p className="text-zinc-600 text-[9px] uppercase tracking-[0.5em] font-medium">
                    &copy; {new Date().getFullYear()} ShotByHamadi Media. All Rights Reserved.
                </p>
            </footer>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in p-4 md:p-12 cursor-zoom-out"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="absolute top-6 left-6 flex gap-4 z-50 pointer-events-auto" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => handleStatusChange(localImages.find(i => i.url.includes(lightboxImage.split('key=')[1] || lightboxImage))?.id || 0, 'favorite')}
                            className={`p-3 border rounded-full transition-all ${localImages.find(i => i.url.includes(lightboxImage.split('key=')[1] || lightboxImage))?.client_status === 'favorite' ? 'border-red-500 text-red-500 bg-red-500/10 scale-110' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white'}`}
                        >
                            ♥
                        </button>
                        <button
                            onClick={() => handleStatusChange(localImages.find(i => i.url.includes(lightboxImage.split('key=')[1] || lightboxImage))?.id || 0, 'liked')}
                            className={`p-3 border rounded-full transition-all ${localImages.find(i => i.url.includes(lightboxImage.split('key=')[1] || lightboxImage))?.client_status === 'liked' ? 'border-green-500 text-green-500 bg-green-500/10 scale-110' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white'}`}
                        >
                            👍
                        </button>
                        <button
                            onClick={() => handleStatusChange(localImages.find(i => i.url.includes(lightboxImage.split('key=')[1] || lightboxImage))?.id || 0, 'disliked')}
                            className={`p-3 border rounded-full transition-all ${localImages.find(i => i.url.includes(lightboxImage.split('key=')[1] || lightboxImage))?.client_status === 'disliked' ? 'border-red-900 text-red-900 bg-red-900/10 scale-110' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white'}`}
                        >
                            👎
                        </button>
                    </div>

                    <button
                        className="absolute top-6 right-6 text-zinc-500 hover:text-white text-3xl font-light p-4 z-50 transition-colors pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
                    >
                        &times;
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center group cursor-default" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={lightboxImage}
                            alt="Lightbox Preview"
                            fill
                            className="object-contain pointer-events-none"
                            quality={100}
                        />

                        {/* Download Overlay */}
                        <div className="absolute bottom-10 w-full flex flex-col items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <label className="flex items-center gap-3 cursor-pointer group/consent bg-black/60 backdrop-blur px-6 py-3 rounded-full border border-zinc-800 pointer-events-auto">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="appearance-none w-4 h-4 border border-[#A1A1AA] bg-transparent checked:bg-[#A1A1AA] transition-colors cursor-pointer"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    />
                                    {acceptedTerms && (
                                        <svg className="absolute w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-[#A1A1AA] group-hover/consent:text-white transition-colors">
                                    I agree to the <Link href="/terms" target="_blank" className="underline hover:text-white">Terms & Personal Use License</Link>.
                                </span>
                            </label>

                            <button
                                onClick={(e) => handleDownload(lightboxImage, e)}
                                disabled={!acceptedTerms}
                                className={`px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center gap-3 pointer-events-auto shadow-2xl ${acceptedTerms
                                    ? "bg-[#A1A1AA] text-black hover:bg-white active:scale-95 cursor-pointer"
                                    : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download High-Res
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
