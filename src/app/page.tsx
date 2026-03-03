"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

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

  useEffect(() => {
    if (!isLoading) {
      const publicCount = mediaList.filter(m => m.is_public === 1).length;
      const privateCount = mediaList.filter(m => m.is_public === 0).length;
      console.log(`[Security Audit] Public Images Rendered: ${publicCount} | Private Images Blocked: ${privateCount}`);
    }
  }, [isLoading, mediaList]);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#A1A1AA] selection:text-black font-sans">
      <Header />

      <main className="flex-grow flex flex-col justify-start items-center text-center px-6 pt-16 pb-24">
        {/* Hero Section */}
        <div className="mb-20 flex flex-col items-center w-full animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.3em] uppercase mb-6 text-white leading-tight">
            Capture the moment
          </h1>
          <p className="text-[#A1A1AA] tracking-[0.4em] uppercase text-[10px] md:text-xs mb-10 max-w-xl">
            High-End Professional Photography & Videography
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="border border-[#A1A1AA] text-[#A1A1AA] px-10 py-4 hover:bg-[#A1A1AA] hover:text-[#000000] transition-all duration-300 uppercase text-[11px] tracking-widest font-bold">
              Get in Touch
            </button>
            <Link href="/services"
              className="bg-[#A1A1AA] text-[#000000] px-10 py-4 font-bold hover:bg-white transition-all duration-300 uppercase text-[11px] tracking-widest">
              View Services
            </Link>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full max-w-7xl">
          {isLoading ? (
            <div className="text-xs tracking-widest text-zinc-500 uppercase h-40 flex items-center justify-center">Loading Portfolio...</div>
          ) : (
            <>
              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`uppercase text-[10px] tracking-widest px-6 py-2 transition-all duration-300 border-b-2 ${activeCategory === "All"
                    ? "border-[#A1A1AA] text-[#A1A1AA]"
                    : "border-transparent text-zinc-500 hover:text-white"
                    }`}
                >
                  All
                </button>
                {categories.filter(cat => cat.name.toLowerCase() !== "all" && mediaList.some(img => img.category_id === cat.id)).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`uppercase text-[10px] tracking-widest px-6 py-2 transition-all duration-300 border-b-2 ${activeCategory === cat.id
                      ? "border-[#A1A1AA] text-[#A1A1AA]"
                      : "border-transparent text-zinc-500 hover:text-white"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 animate-fade-in">
                {filteredImages.length === 0 ? (
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 text-zinc-600 text-[10px] uppercase tracking-widest border border-zinc-900/50">
                    No media available in this category.
                  </div>
                ) : (
                  filteredImages.map((img) => (
                    <div key={img.id} className="break-inside-avoid relative group overflow-hidden bg-[#27272A] mb-4 cursor-pointer">
                      <Image
                        src={img.url}
                        alt={img.alt_text || "Gallery Image"}
                        width={1000}
                        height={600} // Default fallback height ratio
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[#000000]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-[#A1A1AA] text-sm tracking-[0.3em] uppercase font-light translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          {img.alt_text || "View Project"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 w-full p-10 flex flex-col items-center justify-center gap-4 border-t border-zinc-900/50">
        <p className="text-zinc-600 text-[9px] uppercase tracking-[0.5em] font-medium text-center">
          &copy; {new Date().getFullYear()} ShotByHamadi Media. All Rights Reserved.
        </p>
        <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors text-[9px] uppercase tracking-widest font-medium">
          Terms & Guidelines
        </Link>
      </footer>
      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4 md:p-6">
          <div className="bg-[#000000] border border-zinc-800 p-6 md:p-10 max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors text-2xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-2xl font-light tracking-[0.3em] uppercase text-white mb-2">Contact Studio</h2>
            <p className="text-[#A1A1AA] tracking-widest uppercase text-[10px] mb-10">Inquiries & Bookings</p>

            <div className="space-y-8 text-sm tracking-widest font-light uppercase">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-600 text-[9px]">Direct Line</span>
                <a href="tel:4234630833" className="hover:text-[#A1A1AA] transition-colors">(423) 463-0833</a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-600 text-[9px]">Email</span>
                <a href="mailto:contact@shotbyhamadi.com" className="hover:text-[#A1A1AA] transition-colors">contact@shotbyhamadi.com</a>
              </div>
              <div className="pt-6 border-t border-zinc-900 flex gap-6">
                <a href="https://www.tiktok.com/@shotbyhamadi" target="_blank" rel="noopener noreferrer" className="hover:text-[#A1A1AA] transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 3.73 1.19" /></svg>
                  TikTok
                </a>
                <a href="https://www.instagram.com/shotbyhamadi/" target="_blank" rel="noopener noreferrer" className="hover:text-[#A1A1AA] transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
