export const runtime = "edge";

import Link from "next/link";
import { ReactNode } from "react";

const docsSections = [
    {
        group: "01_LEGAL",
        links: [{ href: "/docs/legal", label: "Master Service Agreement" }],
    },
    {
        group: "02_PLATFORM",
        links: [
            { href: "/docs/admin", label: "Admin Dashboard" },
            { href: "/docs/portal", label: "Client Portal" },
        ],
    },
    {
        group: "03_DATABASE",
        links: [
            { href: "/docs/schema", label: "D1 Schema" },
            { href: "/docs/storage", label: "R2 Storage" },
        ],
    },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#A1A1AA] selection:text-black">
            <div className="max-w-7xl mx-auto px-6 py-12 flex gap-0 md:gap-14">

                {/* Sticky Sidebar — desktop */}
                <aside className="hidden md:block w-56 flex-shrink-0">
                    <div className="sticky top-28">
                        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-600 mb-6 font-mono">Documentation</p>
                        <nav className="flex flex-col gap-6">
                            {docsSections.map((section) => (
                                <div key={section.group}>
                                    <p className="text-[9px] tracking-[0.35em] uppercase text-[#A1A1AA] font-mono mb-2">
                                        {section.group}
                                    </p>
                                    <div className="flex flex-col gap-1 border-l border-zinc-900 pl-3">
                                        {section.links.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="text-xs text-zinc-500 hover:text-white transition-colors duration-200 tracking-wide py-0.5"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Mobile ToC — collapsible */}
                <div className="md:hidden w-full mb-8">
                    <details className="border border-zinc-900 group">
                        <summary className="px-4 py-3 text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-mono cursor-pointer flex items-center justify-between select-none">
                            Table of Contents
                            <span className="group-open:rotate-180 transition-transform duration-200">▾</span>
                        </summary>
                        <nav className="px-4 pb-4 flex flex-col gap-4 border-t border-zinc-900 mt-3 pt-3">
                            {docsSections.map((section) => (
                                <div key={section.group}>
                                    <p className="text-[9px] tracking-[0.35em] uppercase text-[#A1A1AA] font-mono mb-1">{section.group}</p>
                                    <div className="flex flex-col gap-1 border-l border-zinc-900 pl-3">
                                        {section.links.map((link) => (
                                            <Link key={link.href} href={link.href} className="text-xs text-zinc-500 hover:text-white transition-colors tracking-wide">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </details>
                </div>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
