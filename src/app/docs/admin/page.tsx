export const runtime = "edge";

import type { Metadata } from "next";
import { auth } from "@/auth";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admin Dashboard Documentation — ShotByHamadi",
    description: "Technical reference for the ShotByHamadi Admin CMS.",
};

const adminSections = [
    {
        id: "01",
        code: "01_SERVICE_MANAGER",
        title: "Service Manager",
        content: "The Service Manager allows administrators to create, read, update, and delete service offerings. Key features include the ability to specify the service category, assign a custom travel fee surcharge for locations outside the local radius, and add a mandatory policy note (e.g., 'Requires 50% non-refundable retainer'). Services can also be toggled active or inactive.",
    },
    {
        id: "02",
        code: "02_PROJECT_MANAGER",
        title: "Project & Portal Manager",
        content: "Administrators can generate secure client portals by creating a Project. Each project requires a Client Name, Email, and a unique 6-character Project Code. Upon creation, a dedicated access URL and password are generated. The portal allows clients to view and download their high-resolution assets hosted in Cloudflare R2.",
    },
];

export default async function AdminDocsPage() {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border border-red-900/30 bg-red-950/10 p-12">
                <span className="text-red-500 mb-4 text-4xl">⊘</span>
                <p className="font-mono text-[10px] tracking-[0.4em] text-red-500/70 uppercase mb-3">02_PLATFORM / Admin Dashboard</p>
                <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white mb-6">
                    Access Denied
                </h1>
                <p className="text-zinc-400 text-sm max-w-sm mb-8">
                    You must be authenticated as an administrator to view this technical documentation.
                </p>
                <Link
                    href="/admin/login"
                    className="text-[10px] font-mono uppercase tracking-[0.2em] text-white bg-zinc-900 hover:bg-zinc-800 px-6 py-3 transition-colors"
                >
                    Authenticate
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-12 border-b border-zinc-900 pb-10">
                <div className="flex items-center gap-4 mb-3">
                    <p className="font-mono text-[9px] tracking-[0.4em] text-emerald-500/70 uppercase">02_PLATFORM / Admin Dashboard</p>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-500 border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5">AUTH: Verified</span>
                </div>
                <h1 className="text-4xl font-light tracking-[0.12em] uppercase text-white mb-4">
                    Admin Dashboard
                </h1>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mt-4">
                    Technical documentation for the ShotByHamadi internal Content Management System.
                    This documentation is only visible to authenticated administrators.
                </p>
            </div>

            {/* Content Sections */}
            <div className="flex flex-col gap-12">
                {adminSections.map((section) => (
                    <div key={section.id} id={`section-${section.code}`} className="scroll-mt-28 border border-zinc-900 p-8 bg-[#0a0a0a]">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="font-mono text-[10px] tracking-[0.35em] text-[#A1A1AA] uppercase">
                                {section.code}
                            </span>
                            <div className="flex-1 h-px bg-zinc-900" />
                        </div>
                        <h2 className="text-lg font-medium tracking-[0.1em] text-white mb-4">
                            {section.title}
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
