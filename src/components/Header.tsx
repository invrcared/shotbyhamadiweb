"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const leftNavLinks = [
        { href: "/", label: "Work" },
        { href: "/albums", label: "Albums" },
    ];
    const rightNavLinks = [
        { href: "/services", label: "Services" },
        { href: "/docs", label: "Docs" },
        { href: "/portal", label: "Portal" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const NavItem = ({ link }: { link: { href: string; label: string } }) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
            <Link
                href={link.href}
                className={`relative py-1 transition-colors duration-300 text-[10px] tracking-widest uppercase font-medium ${isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-[#a78bfa]"
                    }`}
            >
                {link.label}
                {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-full" />
                )}
            </Link>
        );
    };

    return (
        <>
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] md:max-w-2xl lg:max-w-3xl transition-all duration-300">
                <div className="flex items-center justify-between md:justify-center md:gap-10 bg-[#050510]/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] px-6 md:px-10 py-3 md:py-4" style={{ borderRadius: '9999px' }}>

                    {/* Mobile View: Logo & Hamburger */}
                    <div className="md:hidden flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
                            <Image src="/white-transparent.png" alt="ShotByHamadi Logo" width={110} height={30} className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                        <button
                            className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 relative z-[110]"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle Mobile Menu"
                        >
                            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
                            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                        </button>
                    </div>

                    {/* Desktop View: Left Links */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {leftNavLinks.map((link) => <NavItem key={link.href} link={link} />)}
                    </nav>

                    {/* Desktop View: Center Logo */}
                    <Link href="/" className="hidden md:flex items-center group relative shrink-0 mx-2">
                        <Image src="/white-transparent.png" alt="ShotByHamadi Logo" width={130} height={35} className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                        <div className="absolute inset-0 bg-white/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </Link>

                    {/* Desktop View: Right Links */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {rightNavLinks.map((link) => <NavItem key={link.href} link={link} />)}
                    </nav>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[90] bg-[#050510]/95 backdrop-blur-2xl animate-fade-in flex flex-col items-center justify-center pt-24">
                    <nav className="flex flex-col gap-8 items-center text-center w-full h-full overflow-y-auto py-12 px-6">
                        {[...leftNavLinks, ...rightNavLinks].map((link) => {
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
                            <a href="tel:4236714987" className="text-[10px] text-[#a78bfa] uppercase tracking-widest hover:text-white transition-colors">Call Studio</a>
                            <a href="mailto:contact@shotbyhamadi.com" className="text-[10px] text-[#a78bfa] uppercase tracking-widest hover:text-white transition-colors">Email Studio</a>
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
