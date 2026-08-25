"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Work" },
        { href: "/albums", label: "Albums" },
        { href: "/services", label: "Services" },
        { href: "/docs", label: "Docs" },
        { href: "/portal", label: "Portal" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className="sticky top-0 z-[100] w-full bg-[#050510]/70 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
                    <Link href="/" className="flex items-center group relative z-[110]" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image src="/white-transparent.png" alt="ShotByHamadi Logo" width={150} height={40} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center text-xs tracking-widest uppercase text-zinc-500">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative py-1 transition-colors duration-300 ${isActive
                                        ? "text-white"
                                        : "hover:text-[#a78bfa]"
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Icon */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 relative z-[110]"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle Mobile Menu"
                    >
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-20 z-[90] bg-[#050510]/95 backdrop-blur-2xl animate-fade-in flex flex-col items-center justify-center border-t border-white/[0.06]">
                    <nav className="flex flex-col gap-8 items-center text-center w-full h-full overflow-y-auto py-12 px-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-xl tracking-[0.3em] uppercase transition-colors duration-300 ${isActive ? "text-white font-bold" : "text-zinc-500 hover:text-[#a78bfa]"}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="mt-auto pt-10 border-t border-white/[0.06] w-48 text-center flex flex-col gap-4 pb-10">
                            <a href="mailto:contact@shotbyhamadi.com" className="text-[10px] text-[#a78bfa] uppercase tracking-widest hover:text-white transition-colors">Contact Studio</a>
                            <div className="flex gap-6 justify-center text-zinc-600 mt-2">
                                <a href="https://www.instagram.com/shotbyhamadi/" target="_blank" rel="noopener noreferrer" className="hover:text-[#a78bfa] transition-colors">IG</a>
                                <a href="https://www.tiktok.com/@shotbyhamadi" target="_blank" rel="noopener noreferrer" className="hover:text-[#a78bfa] transition-colors">TT</a>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
