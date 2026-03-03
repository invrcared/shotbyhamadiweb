export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Documentation — ShotByHamadi",
    description: "Technical documentation, legal agreements, and operational guidelines for ShotByHamadi Media.",
};

const sections = [
    {
        code: "01_LEGAL",
        title: "Legal & Agreements",
        description: "Master Service Agreement covering asset retention, travel policy, conduct, delivery, and usage rights.",
        href: "/docs/legal",
        tag: "MSA v2026.03",
    },
    {
        code: "02_PLATFORM",
        title: "Admin Dashboard",
        description: "Internal CMS for managing media, client projects, service pricing, and portal access.",
        href: "/docs/admin",
        tag: "Internal",
    },
    {
        code: "02_PLATFORM",
        title: "Client Portal",
        description: "Secure password-protected galleries serving high-resolution R2 assets to clients.",
        href: "/docs/portal",
        tag: "Client-facing",
    },
    {
        code: "03_DATABASE",
        title: "D1 Schema Reference",
        description: "Cloudflare D1 database schema for Services, Projects, Categories, and Media tables.",
        href: "/docs/schema",
        tag: "SQL / Edge",
    },
    {
        code: "03_DATABASE",
        title: "R2 Storage",
        description: "Cloudflare R2 bucket structure for portfolio and client portal media assets.",
        href: "/docs/storage",
        tag: "Object Storage",
    },
];

export default function DocsIndexPage() {
    return (
        <div>
            <div className="mb-14 border-b border-zinc-900 pb-10">
                <p className="font-mono text-[10px] tracking-[0.4em] text-[#A1A1AA] uppercase mb-3">ShotByHamadi Media</p>
                <h1 className="text-4xl font-light tracking-[0.15em] uppercase text-white mb-4">Documentation</h1>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                    Technical and legal reference for the ShotByHamadi platform — covering the Admin system,
                    Client Portal, database schema, and the Master Service Agreement governing all sessions.
                </p>
            </div>

            <div className="flex flex-col gap-px border border-zinc-900">
                {sections.map((s, i) => (
                    <Link
                        key={i}
                        href={s.href}
                        className="group flex items-start justify-between p-6 bg-[#000000] hover:bg-zinc-900/40 transition-colors duration-200 border-b border-zinc-900 last:border-b-0"
                    >
                        <div className="flex-1">
                            <p className="font-mono text-[9px] tracking-[0.35em] text-zinc-600 uppercase mb-1">{s.code}</p>
                            <h2 className="text-sm font-medium tracking-wide text-white mb-1 group-hover:text-[#A1A1AA] transition-colors">{s.title}</h2>
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg">{s.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-start gap-4 ml-6 mt-1">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-700 border border-zinc-900 px-2 py-1">{s.tag}</span>
                            <span className="text-zinc-700 group-hover:text-[#A1A1AA] transition-colors text-xs">→</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
