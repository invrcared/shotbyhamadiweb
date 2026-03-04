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
        { href: "/admin", label: "Admin" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className="sticky top-0 z-[100] w-full bg-[#000000]/80 backdrop-blur-md border-b border-zinc-900/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
                    <Link href="/" className="flex items-center group relative z-[110]" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image src="/white-transparent.png" alt="ShotByHamadi Logo" width={150} height={40} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center text-xs tracking-widest uppercase text-zinc-500">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-colors duration-300 ${pathname === link.href ? "text-white" : "hover:text-[#A1A1AA]"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Icon */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 relative z-[110]"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle Mobile Menu"
                    >
                        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "rotate-45 translate-y-2 text-[#A1A1AA]" : ""}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "-rotate-45 -translate-y-2 text-[#A1A1AA]" : ""}`}></span>
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-20 z-[90] bg-black/95 backdrop-blur-xl animate-fade-in flex flex-col items-center justify-center border-t border-zinc-900/50">
                    <nav className="flex flex-col gap-8 items-center text-center w-full h-full overflow-y-auto py-12 px-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-xl tracking-[0.3em] uppercase transition-colors duration-300 ${pathname === link.href ? "text-white font-bold" : "text-zinc-500 hover:text-[#A1A1AA]"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-auto pt-10 border-t border-zinc-900 w-48 text-center flex flex-col gap-4 pb-10">
                            <a href="mailto:contact@shotbyhamadi.com" className="text-[10px] text-[#A1A1AA] uppercase tracking-widest hover:text-white transition-colors">Contact Studio</a>
                            <div className="flex gap-6 justify-center text-zinc-600 mt-2">
                                <a href="https://www.instagram.com/shotbyhamadi/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">IG</a>
                                <a href="https://www.tiktok.com/@shotbyhamadi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TT</a>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
