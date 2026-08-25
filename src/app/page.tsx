"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface MediaItem {
  id: number;
  url: string;
  category_name: string;
  alt_text: string;
  category_id?: number | null;
  is_public?: number;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number | "All">("All");
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories?active=true').then(res => res.json()),
      fetch('/api/media?publicOnly=true').then(res => res.json())
    ]).then(([fetchedCategories, fetchedMedia]) => {
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
      setMediaList(Array.isArray(fetchedMedia) ? fetchedMedia : []);
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to load portfolio data", err);
      setIsLoading(false);
    });
  }, []);

  const filteredImages = activeCategory === "All"
    ? mediaList.filter(img => img.is_public === 1)
    : mediaList.filter(img => img.category_id === activeCategory && img.is_public === 1);

  return (
    <div className="min-h-screen text-white selection:bg-[#8b5cf6]/30 selection:text-white font-sans">

      <main className="flex-grow flex flex-col justify-start items-center text-center px-6 pt-16 pb-24">
        {/* Hero Section */}
        <div className="mb-20 flex flex-col items-center w-full animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-[var(--font-outfit)] font-light tracking-[0.2em] uppercase mb-6 leading-tight gradient-text">
            Capture the moment
          </h1>
          <p className="text-zinc-400 tracking-[0.4em] uppercase text-[10px] md:text-xs mb-10 max-w-xl">
            High-End Professional Photography & Videography
          </p>
          <div className="flex flex-col md:flex-row gap-5">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="btn-outline-glow px-10 py-4 uppercase text-[11px] tracking-widest font-bold rounded-sm"
            >
              Get in Touch
            </button>
            <Link href="/services"
              className="btn-gradient px-10 py-4 font-bold uppercase text-[11px] tracking-widest rounded-sm text-center"
            >
              View Services
            </Link>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full max-w-7xl">
          {isLoading ? (
            <div className="text-xs tracking-widest text-zinc-500 uppercase h-40 flex items-center justify-center">
              <span className="animate-pulse">Loading Portfolio...</span>
            </div>
          ) : (
            <>
              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`uppercase text-[10px] tracking-widest px-6 py-3 transition-all duration-300 rounded-full font-medium ${activeCategory === "All"
                    ? "bg-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                    : "bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.08]"
                    }`}
                >
                  All
                </button>
                {categories.filter(cat => cat.name.toLowerCase() !== "all" && mediaList.some(img => img.category_id === cat.id)).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`uppercase text-[10px] tracking-widest px-6 py-3 transition-all duration-300 rounded-full font-medium ${activeCategory === cat.id
                      ? "bg-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                      : "bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.08]"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {filteredImages.length === 0 ? (
                <div className="w-full py-20 text-zinc-600 text-[10px] uppercase tracking-widest glass text-center break-inside-avoid rounded-sm">
                  No media available in this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {filteredImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative group overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer glow-border aspect-square bg-[#050510]/50 shadow-lg"
                      onClick={() => setLightboxImage(img)}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text || "Gallery Image"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 protected-image"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                      />
                    </div>

                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 w-full p-10 flex flex-col items-center justify-center gap-4 border-t border-white/[0.06]">
        <p className="text-zinc-600 text-[9px] uppercase tracking-[0.5em] font-medium text-center">
          &copy; {new Date().getFullYear()} ShotByHamadi Media. All Rights Reserved.
        </p>
        <div className="flex gap-4 items-center">
          <Link href="/docs/legal" className="text-zinc-500 hover:text-[#a78bfa] transition-colors text-[9px] uppercase tracking-widest font-medium">
            Terms & Guidelines
          </Link>
          <span className="text-zinc-700">|</span>
          <Link href="/docs" className="text-zinc-500 hover:text-[#a78bfa] transition-colors text-[9px] uppercase tracking-widest font-medium">
            Documentation / Docs
          </Link>
        </div>
      </footer>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4 md:p-6">
          <div className="glass border-white/10 p-6 md:p-10 max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh] rounded-lg">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors text-2xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-2xl font-[var(--font-outfit)] font-light tracking-[0.2em] uppercase text-white mb-2">Contact Studio</h2>
            <p className="text-[#a78bfa] tracking-widest uppercase text-[10px] mb-10">Inquiries & Bookings</p>

            <div className="space-y-8 text-sm tracking-widest font-light uppercase">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-600 text-[9px]">Direct Line</span>
                <a href="tel:4236714987" className="hover:text-[#a78bfa] transition-colors">423-671-4987</a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-600 text-[9px]">Email</span>
                <a href="mailto:contact@shotbyhamadi.com" className="hover:text-[#a78bfa] transition-colors">contact@shotbyhamadi.com</a>
              </div>
              <div className="pt-6 border-t border-white/[0.06] flex gap-6">
                <a href="https://www.tiktok.com/@shotbyhamadi" target="_blank" rel="noopener noreferrer" className="hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 3.73 1.19" /></svg>
                  TikTok
                </a>
                <a href="https://www.instagram.com/shotbyhamadi/" target="_blank" rel="noopener noreferrer" className="hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
          onContextMenu={(e) => e.preventDefault()}
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
              className="max-w-full max-h-[90vh] object-contain shadow-2xl pointer-events-auto select-none protected-image rounded-sm"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-6 py-2 text-[10px] tracking-widest uppercase text-white/50 pointer-events-none flex items-center gap-2 rounded-full shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.97-1.3-3.15-3.61-3.15-2.29 0-3.83 1.15-3.83 3.12 0 1.95 1.4 2.62 3.69 3.2 1.83.47 2.4 1.05 2.4 1.86 0 .97-.92 1.58-2.28 1.58-1.57 0-2.22-.84-2.28-1.93H7.95c.08 2.05 1.5 3.32 3.97 3.32 2.42 0 4.01-1.22 4.01-3.23.01-2.02-1.36-2.65-3.62-3.26z" /></svg>
              &copy; {new Date().getFullYear()} ShotByHamadi
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
