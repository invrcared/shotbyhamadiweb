"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Tab = "media" | "project" | "price" | "categories" | "albums";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Album {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image_url: string;
    date: string;
    is_published: number;
}

interface MediaItem {
    id: number;
    url: string;
    category_name: string;
    alt_text: string;
    is_public: number;
}

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("media");

    // Dynamic Data State
    const [categories, setCategories] = useState<Category[]>([]);
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null);
    const [stats, setStats] = useState({ totalMedia: 0, activeProjects: 0, storageUsed: "0 GB" });

    // Albums
    const [albums, setAlbums] = useState<Album[]>([]);
    const [albumForm, setAlbumForm] = useState<Partial<Album>>({});
    const [isAddingAlbum, setIsAddingAlbum] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState("");

    // Forms & UI States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [uploadDestination, setUploadDestination] = useState<"portfolio" | "portal" | "albums">("portfolio");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedProject, setSelectedProject] = useState<string>("");

    // Category Creation
    const [newCategoryName, setNewCategoryName] = useState("");

    // Projects
    interface Project {
        id: string;
        client: string;
        code: string;
        slug: string;
        date: string;
    }
    const [projects, setProjects] = useState<Project[]>([]);
    const [clientName, setClientName] = useState("");
    const [projectSlug, setProjectSlug] = useState("");
    const [projectLocation, setProjectLocation] = useState("United States");
    const [projectPassword, setProjectPassword] = useState("");
    const [basePrice, setBasePrice] = useState<number>(0);
    const [travelSurcharge, setTravelSurcharge] = useState<number>(0);
    const [projectNotes, setProjectNotes] = useState("");

    // Services (Price) State
    interface Service {
        id: number;
        title: string;
        description: string;
        price: number;
        features?: string;
        category?: string;
        travel_fee?: number;
        policy_note?: string;
        is_active?: number;
    }
    const [prices, setPrices] = useState<Service[]>([]);
    const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Service> & { parsedFeatures?: string[] }>({});
    const [isAddingService, setIsAddingService] = useState(false);
    const [newServiceForm, setNewServiceForm] = useState({
        title: "", description: "", price: 0, parsedFeatures: [""] as string[],
        category: "General", travel_fee: 0, policy_note: "", is_active: 1
    });

    // Toast Notification
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const SERVICE_CATEGORIES = ["General", "Portraits", "Events", "Weddings", "Sports", "Automotive", "Commercial"];

    useEffect(() => {
        setMounted(true);
        fetchStats();
        fetchCategories();
        fetchMedia();
        fetchServices();
        fetchProjects();
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        const res = await fetch('/api/albums');
        if (res.ok) setAlbums(await res.json());
    };

    const fetchProjects = async () => {
        const res = await fetch('/api/projects');
        if (res.ok) setProjects(await res.json());
    };

    const fetchServices = async () => {
        const res = await fetch('/api/services');
        if (res.ok) setPrices(await res.json());
    };

    const handleEditService = (service: Service) => {
        setEditingServiceId(service.id);
        let parsed: string[] = [];
        try { parsed = JSON.parse(service.features || "[]"); } catch { }
        setEditForm({ ...service, parsedFeatures: parsed });
    };

    const handleSaveService = async () => {
        if (!editingServiceId) return;
        const res = await fetch('/api/services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...editForm, features: editForm.parsedFeatures?.filter((f: string) => f.trim() !== "") })
        });
        if (res.ok) {
            showToast("Service updated successfully");
        } else {
            showToast("Failed to update service", "error");
        }
        setEditingServiceId(null);
        setEditForm({});
        fetchServices();
    };

    const handleCreateService = async () => {
        if (!newServiceForm.title) return;
        const res = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newServiceForm, features: newServiceForm.parsedFeatures.filter(f => f.trim() !== "") })
        });
        if (res.ok) {
            showToast("Service created successfully");
        } else {
            showToast("Failed to create service", "error");
        }
        setIsAddingService(false);
        setNewServiceForm({ title: "", description: "", price: 0, parsedFeatures: [""], category: "General", travel_fee: 0, policy_note: "", is_active: 1 });
        fetchServices();
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm("Delete this service?")) return;
        const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast("Service deleted");
        } else {
            showToast("Failed to delete service", "error");
        }
        fetchServices();
    };

    const fetchStats = async () => {
        const res = await fetch('/api/stats');
        if (res.ok) setStats(await res.json());
    };

    const fetchCategories = async () => {
        const res = await fetch('/api/categories?t=' + Date.now());
        if (res.ok) setCategories(await res.json());
    };

    const fetchMedia = async () => {
        const res = await fetch('/api/media');
        if (res.ok) setMediaList(await res.json());
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;

        const res = await fetch('/api/categories', {
            method: 'POST',
            body: JSON.stringify({ name: newCategoryName }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            showToast("Category created successfully");
            setNewCategoryName("");
            fetchCategories(); // Refresh list
        } else {
            const data = (await res.json()) as { error?: string };
            showToast(data.error || "Failed to create category", "error");
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Are you sure? This will not delete media but sets their category to null.")) return;
        const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast("Category deleted");
            fetchCategories();
            fetchMedia(); // Refresh media since category names change
        } else {
            showToast("Failed to delete category", "error");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadStatus(`Uploading ${files.length} file(s)...`);

        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Step 1: Upload to R2 Bucket
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!uploadRes.ok) {
                    const errText = await uploadRes.text();
                    console.error("Upload failed:", errText);
                    alert("Upload error: " + errText);
                    throw new Error("Upload to R2 failed");
                }

                const uploadData = await uploadRes.json() as { fileName: string };
                const fileName = uploadData.fileName; // The generated R2 key

                // Step 2: Insert into D1 Media Table
                const isPortfolio = uploadDestination === "portfolio" || uploadDestination === "albums";
                const payload: Record<string, string | number | boolean> = {
                    url: fileName,
                    altText: file.name,
                    isPublic: isPortfolio
                };

                if (uploadDestination === "portfolio" && selectedCategory) {
                    payload.categoryId = Number(selectedCategory);
                } else if (uploadDestination === "portal" && selectedProject) {
                    payload.projectId = selectedProject;
                } else if (uploadDestination === "albums" && selectedAlbum) {
                    payload.albumId = Number(selectedAlbum);
                }

                const res = await fetch('/api/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    successCount++;
                } else {
                    const dbErr = await res.text();
                    console.error("DB Insert Failed for", file.name, dbErr);
                    alert("DB Save Error: " + dbErr);
                }
            } catch (error) {
                console.error("Upload Error for", file.name, error);
                alert("Runtime Error: " + String(error));
            }
        }

        setUploadStatus(successCount === files.length ? "Upload Complete!" : `Uploaded ${successCount}/${files.length} files.`);
        fetchMedia();
        fetchStats();
        setIsUploading(false);
        setTimeout(() => setUploadStatus(null), 4000);
    };

    const handleDeleteMedia = async (id: number) => {
        if (!confirm("Permanently delete this media?")) return;
        await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
        fetchMedia();
        fetchStats();
    };

    const handleTogglePublic = async (id: number, currentStatus: number) => {
        await fetch('/api/media', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, is_public: currentStatus === 1 ? false : true })
        });
        fetchMedia();
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName) return;

        const res = await fetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify({
                clientName,
                projectSlug,
                location: projectLocation,
                projectPassword,
                basePrice,
                travelSurcharge,
                notes: projectNotes
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            setClientName("");
            setProjectSlug("");
            setProjectLocation("United States");
            setProjectPassword("");
            setBasePrice(0);
            setTravelSurcharge(0);
            setProjectNotes("");
            fetchProjects();
            alert("Project Folder Created Successfully!");
        } else {
            alert("Failed to create project");
        }
    };

    if (!mounted) {
        return <div className="min-h-screen bg-[#000000] text-[#A1A1AA] flex items-center justify-center tracking-widest uppercase text-xs">Loading Secure Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#A1A1AA] selection:text-black font-sans">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 border text-xs tracking-widest uppercase font-bold shadow-2xl transition-all duration-300 ${toast.type === "success"
                    ? "bg-zinc-900 border-[#A1A1AA] text-white"
                    : "bg-zinc-900 border-red-700 text-red-400"
                    }`}>
                    <span className={toast.type === "success" ? "text-[#A1A1AA]" : "text-red-500"}>■</span>
                    {toast.message}
                </div>
            )}
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar / Top Nav on Mobile */}
                <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-900/50 flex flex-col bg-[#000000] sticky top-0 md:static z-50">
                    <div className="p-4 md:p-6 border-b border-zinc-900/50 flex justify-between items-center md:items-start md:flex-col">
                        <div>
                            <h2 className="text-base md:text-lg font-light tracking-[0.2em] uppercase mb-1">Admin Portal</h2>
                            <p className="text-zinc-500 text-[10px] md:text-xs tracking-widest uppercase">ShotByHamadi</p>
                        </div>
                        <Link href="/" className="md:hidden text-[10px] text-zinc-500 hover:text-[#A1A1AA] transition-colors uppercase tracking-widest border border-zinc-800 px-3 py-1.5 rounded-sm">
                            Exit
                        </Link>
                    </div>

                    <nav className="flex-none p-2 md:p-4 flex md:flex-col overflow-x-auto snap-x space-x-2 md:space-x-0 md:space-y-2 hide-scrollbar">
                        {["media", "categories", "project", "price", "albums"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as Tab)}
                                className={`flex-shrink-0 md:w-full flex items-center px-4 py-3 text-xs md:text-sm font-medium rounded-sm transition-colors border snap-start whitespace-nowrap ${activeTab === tab
                                    ? "bg-zinc-900 text-white border-zinc-800"
                                    : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900/50"
                                    }`}
                            >
                                <span className={`${activeTab === tab ? "text-[#A1A1AA]" : "text-zinc-600"} mr-3`}>■</span>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} Manager
                            </button>
                        ))}
                    </nav>

                    <div className="hidden md:block p-4 border-t border-zinc-900/50 mt-auto">
                        <Link href="/" className="text-xs text-zinc-500 hover:text-[#A1A1AA] transition-colors uppercase tracking-widest flex items-center">
                            ← Back to Site
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-[#000000] w-full max-w-[100vw]">
                    <div className="p-4 md:p-10 max-w-5xl mx-auto w-full">

                        {/* Stats Section (Global) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 h-32">
                            <div className="border border-zinc-900 p-6 bg-[#000000]">
                                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Total Media</p>
                                <p className="text-4xl font-light">{stats.totalMedia}</p>
                            </div>
                            <div className="border border-zinc-900 p-6 bg-[#000000]">
                                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Active Projects</p>
                                <p className="text-4xl font-light">{stats.activeProjects}</p>
                            </div>
                            <div className="border border-zinc-900 p-6 bg-[#000000]">
                                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Storage Used (R2)</p>
                                <p className="text-4xl font-light">{stats.storageUsed}</p>
                            </div>
                        </div>

                        {activeTab === "media" && (
                            <div className="animate-fade-in">
                                <header className="mb-10 flex flex-col items-start gap-6 border-b border-zinc-900 pb-6 w-full">
                                    <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                                        <div>
                                            <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-2">Media Manager</h1>
                                            <p className="text-zinc-400 text-sm">Upload media intelligently to your portfolio or client portals.</p>
                                        </div>
                                    </div>

                                    {/* Smart Uploader Controls */}
                                    <div className="bg-zinc-900/30 border border-zinc-800 p-6 w-full flex flex-col md:flex-row gap-6 items-start md:items-end">

                                        {/* Destination Toggle */}
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            <label className="text-xs uppercase tracking-widest text-[#A1A1AA]">Destination</label>
                                            <div className="flex bg-[#000000] border border-zinc-800 p-1">
                                                <button
                                                    onClick={() => setUploadDestination("portfolio")}
                                                    className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${uploadDestination === "portfolio" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}`}
                                                >
                                                    Public Portfolio
                                                </button>
                                                <button
                                                    onClick={() => setUploadDestination("portal")}
                                                    className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${uploadDestination === "portal" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}`}
                                                >
                                                    Client Portal
                                                </button>
                                                <button
                                                    onClick={() => setUploadDestination("albums")}
                                                    className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${uploadDestination === "albums" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}`}
                                                >
                                                    Albums
                                                </button>
                                            </div>
                                        </div>

                                        {/* Conditional Dropdown */}
                                        <div className="flex flex-col gap-2 w-full md:w-auto flex-1">
                                            <label className="text-xs uppercase tracking-widest text-[#A1A1AA]">
                                                {uploadDestination === "portfolio" ? "Select Category" : uploadDestination === "albums" ? "Select Album" : "Select Project Folder"}
                                            </label>
                                            {uploadDestination === "portfolio" ? (
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="bg-[#000000] border border-zinc-800 text-white text-xs uppercase tracking-widest px-4 py-2.5 focus:outline-none focus:border-[#A1A1AA] w-full"
                                                >
                                                    <option value="">Ungrouped</option>
                                                    {categories.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            ) : uploadDestination === "albums" ? (
                                                <select
                                                    value={selectedAlbum}
                                                    onChange={(e) => setSelectedAlbum(e.target.value)}
                                                    className="bg-[#000000] border border-zinc-800 text-white text-xs uppercase tracking-widest px-4 py-2.5 focus:outline-none focus:border-[#A1A1AA] w-full"
                                                >
                                                    <option value="">Ungrouped</option>
                                                    {albums.map(a => (
                                                        <option key={a.id} value={a.id}>{a.title}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <select
                                                    value={selectedProject}
                                                    onChange={(e) => setSelectedProject(e.target.value)}
                                                    className="bg-[#000000] border border-zinc-800 text-white text-xs uppercase tracking-widest px-4 py-2.5 focus:outline-none focus:border-[#A1A1AA] w-full"
                                                >
                                                    <option value="">Select a Project...</option>
                                                    {projects.map(p => (
                                                        <option key={p.id} value={p.id}>{p.client} ({p.code})</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        {/* Upload Button */}
                                        <div className="w-full md:w-auto">
                                            <label
                                                htmlFor="file-upload"
                                                className={`bg-[#A1A1AA] text-black px-8 py-3 w-full md:w-auto text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer inline-flex items-center justify-center whitespace-nowrap ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                                            >
                                                {isUploading ? "Uploading..." : "Upload File"}
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                multiple
                                                onChange={handleFileUpload}
                                                disabled={isUploading}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </header>

                                {uploadStatus && (
                                    <div className="mb-6 text-xs text-[#A1A1AA] tracking-widest uppercase">{uploadStatus}</div>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {mediaList.map((media) => {
                                        return (
                                            <div key={media.id} className="relative group border border-zinc-900 overflow-hidden bg-zinc-900/50">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={media.url}
                                                    alt={media.alt_text}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    onClick={() => setLightboxImage(media)}
                                                />
                                                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 text-[10px] text-white uppercase tracking-widest backdrop-blur-sm">
                                                    {media.category_name || "Uncategorized"}
                                                </div>
                                                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-[10px] text-white uppercase tracking-widest backdrop-blur-sm cursor-pointer" onClick={() => handleTogglePublic(media.id, media.is_public)}>
                                                    {media.is_public === 1 ? "Public" : "Private"}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteMedia(media.id)}
                                                    className="absolute bottom-0 left-0 w-full bg-red-900 text-white text-xs py-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 font-bold"
                                                >
                                                    Delete Image
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {mediaList.length === 0 && (
                                        <div className="col-span-4 p-10 text-center text-zinc-500 border border-zinc-900 uppercase tracking-widest text-xs">
                                            No media found. Upload above.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "categories" && (
                            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div>
                                    <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-2">Categories</h1>
                                    <p className="text-zinc-400 text-sm mb-10">Manage portfolio filter tabs.</p>

                                    <form onSubmit={handleCreateCategory} className="mb-8 flex gap-4">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="NEW CATEGORY NAME"
                                            required
                                            className="flex-1 bg-[#000000] border border-zinc-800 p-3 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-[#A1A1AA] transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#A1A1AA] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            Add
                                        </button>
                                    </form>

                                    <div className="border border-zinc-900">
                                        {categories.map((c) => (
                                            <div key={c.id} className="flex items-center justify-between p-4 border-b border-zinc-900/50 last:border-b-0 hover:bg-zinc-900/30">
                                                <div>
                                                    <p className="text-sm font-medium tracking-wide">{c.name}</p>
                                                    <p className="text-xs text-zinc-500">{c.slug}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteCategory(c.id)}
                                                    className="text-[10px] tracking-widest uppercase text-red-900 hover:text-red-500 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "albums" && (
                            <div className="animate-fade-in flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-2">Albums Manager</h1>
                                        <p className="text-zinc-400 text-sm">Create and manage public albums / posts.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddingAlbum(!isAddingAlbum)}
                                        className="bg-[#A1A1AA] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                    >
                                        {isAddingAlbum ? "Cancel" : "Add New Album"}
                                    </button>
                                </div>
                                {isAddingAlbum && (
                                    <div className="border border-zinc-900 p-6 bg-zinc-900/30">
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            const res = await fetch('/api/albums', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ ...albumForm })
                                            });
                                            if (res.ok) {
                                                showToast("Album created");
                                                setIsAddingAlbum(false);
                                                setAlbumForm({});
                                                fetchAlbums();
                                            } else showToast("Failed to create album", "error");
                                        }} className="grid gap-4">
                                            <input className="bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:border-[#A1A1AA]" placeholder="Album Title" value={albumForm.title || ''} onChange={e => {
                                                const title = e.target.value;
                                                setAlbumForm({ ...albumForm, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') });
                                            }} required />
                                            <input className="bg-[#000000] border border-zinc-800 p-3 text-sm text-zinc-500 font-mono" placeholder="slug-name" value={albumForm.slug || ''} onChange={e => setAlbumForm({ ...albumForm, slug: e.target.value })} required />
                                            <input className="bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:border-[#A1A1AA]" placeholder="Cover Image URL (Optional)" value={albumForm.cover_image_url || ''} onChange={e => setAlbumForm({ ...albumForm, cover_image_url: e.target.value })} />
                                            <input className="bg-[#000000] border border-zinc-800 p-3 text-sm text-white" placeholder="Description (Optional)" value={albumForm.description || ''} onChange={e => setAlbumForm({ ...albumForm, description: e.target.value })} />
                                            <input className="bg-[#000000] border border-zinc-800 p-3 text-sm text-white" placeholder="Date String e.g. Oct 2026" value={albumForm.date || ''} onChange={e => setAlbumForm({ ...albumForm, date: e.target.value })} />
                                            <button className="bg-[#A1A1AA] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest">Save Album</button>
                                        </form>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {albums.map(a => (
                                        <div key={a.id} className="border border-zinc-900 p-6 bg-zinc-900/30 flex justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold">{a.title}</h3>
                                                <p className="text-xs text-zinc-500 font-mono">{a.slug} • {a.date}</p>
                                                <p className="text-sm mt-2 text-zinc-400">{a.description}</p>
                                                <div className="mt-4 flex gap-4">
                                                    <span className={`text-xs uppercase ${a.is_published ? "text-[#A1A1AA]" : "text-zinc-600"}`}>
                                                        {a.is_published ? "Published" : "Draft"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 items-end">
                                                <button onClick={async () => {
                                                    if (!confirm("Delete album?")) return;
                                                    await fetch(`/api/albums?id=${a.id}`, { method: 'DELETE' });
                                                    fetchAlbums();
                                                }} className="text-xs uppercase text-red-500 hover:text-red-400 font-bold tracking-widest">DELETE</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects and Prices unchanged UI visually but kept working */}
                        {activeTab === "project" && (
                            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 border border-zinc-900 p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 pb-4 border-b border-zinc-900 text-[#A1A1AA]">New Project</h3>
                                    <form onSubmit={handleCreateProject} className="space-y-4">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Client Name</label>
                                                <input
                                                    type="text"
                                                    value={clientName}
                                                    onChange={(e) => {
                                                        const name = e.target.value;
                                                        setClientName(name);
                                                        setProjectSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                                                    }}
                                                    className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-[#A1A1AA] transition-colors"
                                                    placeholder="e.g. Smith Wedding"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">URL Slug</label>
                                                <input
                                                    type="text"
                                                    value={projectSlug}
                                                    onChange={(e) => setProjectSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                                                    className="w-full bg-zinc-900/50 border border-zinc-800 p-3 text-sm text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA] transition-colors font-mono"
                                                    placeholder="e.g. smith-wedding"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={projectLocation}
                                                    onChange={(e) => setProjectLocation(e.target.value)}
                                                    className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-[#A1A1AA] transition-colors"
                                                    placeholder="e.g. Los Angeles, CA"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Project Password</label>
                                                <input
                                                    type="text"
                                                    value={projectPassword}
                                                    onChange={(e) => setProjectPassword(e.target.value)}
                                                    className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA] transition-colors font-mono"
                                                    placeholder="Optional security key"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Base Price ($)</label>
                                                    <input
                                                        type="number"
                                                        value={basePrice}
                                                        onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-[#A1A1AA] transition-colors"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Travel Surcharge ($)</label>
                                                    <input
                                                        type="number"
                                                        value={travelSurcharge}
                                                        onChange={(e) => setTravelSurcharge(parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-[#A1A1AA] transition-colors"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Admin Notes (Hidden from client)</label>
                                                <textarea
                                                    value={projectNotes}
                                                    onChange={(e) => setProjectNotes(e.target.value)}
                                                    className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA] transition-colors resize-none h-20"
                                                    placeholder="e.g. Far drive to Ringgold mountains."
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[#A1A1AA] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            Create Folder
                                        </button>
                                    </form>
                                </div>
                                <div className="lg:col-span-2 border border-zinc-900 p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 pb-4 border-b border-zinc-900 text-[#A1A1AA]">Active Projects</h3>
                                    <div className="space-y-4">
                                        {projects.map((p) => (
                                            <div key={p.id} className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-900/30">
                                                <div>
                                                    <p className="text-sm font-medium mb-1">{p.client}</p>
                                                    <p className="text-xs text-zinc-500">Created: {p.date}</p>
                                                </div>
                                                <div className="text-right flex items-center gap-3">
                                                    <span className="inline-block bg-[#000000] border border-zinc-700 px-3 py-1 text-xs tracking-widest text-[#A1A1AA] font-mono">
                                                        {p.slug || p.code}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`shotbyhamadi.com/portal/${p.slug || p.code}`);
                                                            alert("Gallery Link Copied!");
                                                        }}
                                                        className="text-[10px] uppercase text-zinc-500 hover:text-white transition-colors tracking-widest"
                                                    >
                                                        Copy Link
                                                    </button>
                                                    <Link
                                                        href={`/portal/${p.slug || p.code}`}
                                                        target="_blank"
                                                        className="text-[10px] uppercase text-[#A1A1AA] hover:text-white border-b border-[#A1A1AA] hover:border-white transition-all tracking-widest pb-0.5"
                                                    >
                                                        View Gallery
                                                    </Link>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm("Permanently delete this project?")) return;
                                                            await fetch(`/api/projects?id=${p.id}`, { method: 'DELETE' });
                                                            fetchProjects();
                                                        }}
                                                        className="text-[10px] uppercase text-red-500 hover:text-red-400 transition-colors tracking-widest ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "price" && (
                            <div className="animate-fade-in flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-2">Price Manager</h1>
                                        <p className="text-zinc-400 text-sm">Manage your service packages and features.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddingService(!isAddingService)}
                                        className="bg-[#A1A1AA] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                    >
                                        {isAddingService ? "Cancel" : "Add New Service"}
                                    </button>
                                </div>

                                {isAddingService && (
                                    <div className="border border-zinc-900 p-6 bg-zinc-900/30">
                                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#A1A1AA]">Create Service</h3>

                                        {/* Row 1: Name + Price */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Service Name</label>
                                                <input className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-[#A1A1AA]" placeholder="e.g. Essential Portraits" value={newServiceForm.title} onChange={e => setNewServiceForm({ ...newServiceForm, title: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Price ($)</label>
                                                <input type="number" className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA]" placeholder="0.00" value={newServiceForm.price === 0 ? '' : newServiceForm.price} onChange={e => setNewServiceForm({ ...newServiceForm, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })} />
                                            </div>
                                        </div>

                                        {/* Row 2: Description */}
                                        <div className="mb-4">
                                            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Brief Description</label>
                                            <input className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-[#A1A1AA]" placeholder="1 Hour Session • 15 Edited Photos" value={newServiceForm.description} onChange={e => setNewServiceForm({ ...newServiceForm, description: e.target.value })} />
                                        </div>

                                        {/* Row 3: Category + Travel Fee */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Category</label>
                                                <select className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-[#A1A1AA] uppercase tracking-widest" value={newServiceForm.category} onChange={e => setNewServiceForm({ ...newServiceForm, category: e.target.value })}>
                                                    {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Travel Fee ($) <span className="text-zinc-600">— 0 if local</span></label>
                                                <input type="number" className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA]" placeholder="0.00" value={newServiceForm.travel_fee || ''} onChange={e => setNewServiceForm({ ...newServiceForm, travel_fee: parseFloat(e.target.value) || 0 })} />
                                            </div>
                                        </div>

                                        {/* Row 4: Policy Note + Active Toggle */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Policy Note <span className="text-zinc-600">— shown under price</span></label>
                                                <input className="w-full bg-[#000000] border border-zinc-800 p-3 text-sm text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA]" placeholder="e.g. 50% retainer required at booking" value={newServiceForm.policy_note} onChange={e => setNewServiceForm({ ...newServiceForm, policy_note: e.target.value })} />
                                            </div>
                                            <div className="flex flex-col justify-end">
                                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Visibility</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewServiceForm({ ...newServiceForm, is_active: newServiceForm.is_active === 1 ? 0 : 1 })}
                                                    className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border transition-colors ${newServiceForm.is_active === 1
                                                        ? "bg-zinc-900 border-[#A1A1AA] text-white"
                                                        : "bg-transparent border-zinc-800 text-zinc-600"
                                                        }`}
                                                >
                                                    {newServiceForm.is_active === 1 ? "● Active" : "○ Hidden"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mb-6">
                                            <label className="block text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">Features (Bullet Points)</label>
                                            {newServiceForm.parsedFeatures.map((f, i) => (
                                                <div key={i} className="flex gap-2 mb-2">
                                                    <input className="flex-1 bg-[#000000] border border-zinc-800 p-2 text-sm text-white focus:outline-none focus:border-[#A1A1AA]" placeholder="e.g. 15 Edited Photos" value={f} onChange={e => { const updated = [...newServiceForm.parsedFeatures]; updated[i] = e.target.value; setNewServiceForm({ ...newServiceForm, parsedFeatures: updated }); }} />
                                                    <button onClick={() => { const updated = newServiceForm.parsedFeatures.filter((_, idx) => idx !== i); setNewServiceForm({ ...newServiceForm, parsedFeatures: updated }); }} className="text-red-900 hover:text-red-500 text-xs tracking-widest uppercase py-2 px-4 transition-colors">Del</button>
                                                </div>
                                            ))}
                                            <button onClick={() => setNewServiceForm({ ...newServiceForm, parsedFeatures: [...newServiceForm.parsedFeatures, ""] })} className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest transition-colors mt-2">+ Add Feature</button>
                                        </div>

                                        <button onClick={handleCreateService} className="bg-[#A1A1AA] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">Save Service</button>
                                    </div>
                                )}

                                <div className="border border-zinc-900 overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="bg-zinc-900/50 border-b border-zinc-900">
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-400">ID</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Service Package</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Category</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Price</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Status</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prices.map((p) => {
                                                let pFeatures: string[] = [];
                                                try { pFeatures = JSON.parse(p.features || "[]"); } catch { }

                                                return (
                                                    <tr key={p.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                                                        <td className="p-4 text-xs text-zinc-600 font-mono align-top">{p.id}</td>

                                                        {editingServiceId === p.id ? (
                                                            <>
                                                                <td className="p-4 align-top" colSpan={3}>
                                                                    {/* Title + Description */}
                                                                    <input
                                                                        className="w-full bg-[#000000] border border-zinc-700 p-2 text-sm text-white focus:outline-none focus:border-[#A1A1AA] mb-2"
                                                                        placeholder="Service Name"
                                                                        value={editForm.title || ""}
                                                                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                                                    />
                                                                    <input
                                                                        className="w-full bg-transparent border-b border-zinc-800 p-1 text-xs text-zinc-500 focus:outline-none focus:text-[#A1A1AA] mb-3"
                                                                        placeholder="Brief description..."
                                                                        value={editForm.description || ""}
                                                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                                    />
                                                                    {/* Category + Travel Fee */}
                                                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                                                        <div>
                                                                            <label className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Category</label>
                                                                            <select className="w-full bg-[#000000] border border-zinc-800 p-2 text-xs text-white focus:outline-none focus:border-[#A1A1AA]" value={editForm.category || "General"} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                                                                                {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Travel Fee ($)</label>
                                                                            <input type="number" className="w-full bg-[#000000] border border-zinc-800 p-2 text-xs text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA]" value={editForm.travel_fee ?? 0} onChange={e => setEditForm({ ...editForm, travel_fee: parseFloat(e.target.value) || 0 })} />
                                                                        </div>
                                                                    </div>
                                                                    {/* Policy Note */}
                                                                    <div className="mb-3">
                                                                        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Policy Note</label>
                                                                        <input className="w-full bg-[#000000] border border-zinc-800 p-2 text-xs text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA]" placeholder="e.g. 50% retainer required at booking" value={editForm.policy_note || ""} onChange={e => setEditForm({ ...editForm, policy_note: e.target.value })} />
                                                                    </div>
                                                                    {/* Features */}
                                                                    <div className="space-y-2">
                                                                        <label className="block text-[10px] uppercase tracking-widest text-zinc-600">Features</label>
                                                                        {editForm.parsedFeatures?.map((f, i) => (
                                                                            <div key={i} className="flex gap-2">
                                                                                <input className="flex-1 bg-[#000000] border border-zinc-800 p-2 text-sm text-zinc-400 focus:outline-none focus:border-[#A1A1AA]" value={f} onChange={e => { const updated = [...(editForm.parsedFeatures || [])]; updated[i] = e.target.value; setEditForm({ ...editForm, parsedFeatures: updated }); }} />
                                                                                <button onClick={() => { const updated = editForm.parsedFeatures?.filter((_, idx) => idx !== i); setEditForm({ ...editForm, parsedFeatures: updated }); }} className="text-red-900 hover:text-red-500 text-xs tracking-widest uppercase px-2 transition-colors">Del</button>
                                                                            </div>
                                                                        ))}
                                                                        <button onClick={() => setEditForm({ ...editForm, parsedFeatures: [...(editForm.parsedFeatures || []), ""] })} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors mt-2">+ Add Feature</button>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-top">
                                                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Price ($)</label>
                                                                    <input
                                                                        type="number"
                                                                        className="w-full bg-[#000000] border border-zinc-700 p-2 text-sm text-[#A1A1AA] font-mono focus:outline-none focus:border-[#A1A1AA]"
                                                                        value={editForm.price === 0 ? '' : editForm.price}
                                                                        onChange={e => setEditForm({ ...editForm, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                                                                    />
                                                                    <div className="mt-3">
                                                                        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Status</label>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setEditForm({ ...editForm, is_active: editForm.is_active === 1 ? 0 : 1 })}
                                                                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-colors ${editForm.is_active === 1
                                                                                ? "bg-zinc-900 border-[#A1A1AA] text-white"
                                                                                : "bg-transparent border-zinc-800 text-zinc-600"
                                                                                }`}
                                                                        >
                                                                            {editForm.is_active === 1 ? "● Active" : "○ Hidden"}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-top"></td>
                                                                <td className="p-4 text-right align-top">
                                                                    <div className="flex flex-col gap-2 items-end">
                                                                        <button onClick={handleSaveService} className="text-xs tracking-widest uppercase text-green-500 hover:text-green-400 transition-colors">Save</button>
                                                                        <button onClick={() => setEditingServiceId(null)} className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">Cancel</button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="p-4 text-sm text-zinc-300 align-top">
                                                                    <div className="font-medium text-white text-base">{p.title}</div>
                                                                    {p.description && <div className="text-xs text-zinc-500 mt-1 mb-3">{p.description}</div>}
                                                                    {pFeatures.length > 0 && (
                                                                        <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 mt-2">
                                                                            {pFeatures.map((f: string, i: number) => (
                                                                                <li key={i}>{f}</li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                    {p.policy_note && (
                                                                        <p className="text-[10px] text-[#A1A1AA] uppercase tracking-widest mt-3 border-t border-zinc-900 pt-2">{p.policy_note}</p>
                                                                    )}
                                                                    {(p.travel_fee ?? 0) > 0 && (
                                                                        <p className="text-[10px] text-zinc-500 mt-1">+ ${p.travel_fee} travel fee</p>
                                                                    )}
                                                                </td>
                                                                <td className="p-4 text-xs text-zinc-500 uppercase tracking-widest align-top">{p.category || "General"}</td>
                                                                <td className="p-4 align-top">
                                                                    <span className="text-sm text-[#A1A1AA] font-mono">${p.price}</span>
                                                                </td>
                                                                <td className="p-4 align-top">
                                                                    <span className={`text-[10px] uppercase tracking-widest font-bold ${p.is_active !== 0 ? "text-[#A1A1AA]" : "text-zinc-700"
                                                                        }`}>
                                                                        {p.is_active !== 0 ? "● Active" : "○ Hidden"}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-right align-top">
                                                                    <div className="flex flex-col gap-2 items-end">
                                                                        <button onClick={() => handleEditService(p)} className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">Edit</button>
                                                                        <button onClick={() => handleDeleteService(p.id)} className="text-xs tracking-widest uppercase text-red-900 hover:text-red-500 transition-colors">Delete</button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors text-4xl font-light leading-none z-[210] mix-blend-difference"
                    >
                        &times;
                    </button>
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={lightboxImage.url}
                            alt={lightboxImage.alt_text || "Enlarged Image"}
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl pointer-events-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
