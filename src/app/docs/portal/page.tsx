export const runtime = "edge";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Client Portal Documentation — ShotByHamadi",
    description: "Technical reference for the ShotByHamadi Client Portal.",
};

const portalSections = [
    {
        id: "01",
        code: "01_ACCESS",
        title: "Secure Portal Access",
        content: "The Client Portal is accessed exclusively via a unique Project Code and an associated password. Both credentials are required for entry. The portal authenticates the input against the D1 Projects database and issues a secure signed cookie (`client_session`) upon successful validation.",
    },
    {
        id: "02",
        code: "02_ASSET_DELIVERY",
        title: "High-Resolution Media Delivery",
        content: "Once authenticated, clients have full access to view, stream, and strictly download their high-resolution photography and videography assets. All media files are hosted redundantly via Cloudflare R2 Object Storage, ensuring global edge performance and minimal latency.",
    },
    {
        id: "03",
        code: "03_EXPIRATION",
        title: "Portal Expiration",
        content: "As defined in the Master Service Agreement, client portals are automatically rendered inactive and purged from the live Edge network 30 days post-delivery. Attempts to log in to an expired portal will return a standard 'Project Expired/Not Found' notice.",
    },
];

export default function PortalDocsPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12 border-b border-zinc-900 pb-10">
                <p className="font-mono text-[9px] tracking-[0.4em] text-zinc-600 uppercase mb-3">02_PLATFORM / Client Portal</p>
                <h1 className="text-4xl font-light tracking-[0.12em] uppercase text-white mb-4">
                    Client Portal
                </h1>
                <p className="text-zinc-500 text-xs font-mono">Client-Facing Application</p>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mt-4">
                    Technical overview of the secure media delivery interface provided to clients following a commissioned session.
                </p>
            </div>

            {/* Content Sections */}
            <div className="flex flex-col gap-12">
                {portalSections.map((section) => (
                    <div key={section.id} id={`section-${section.code}`} className="scroll-mt-28 border border-zinc-900 p-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-6">
                            <span className="font-mono text-[10px] tracking-[0.35em] text-[#A1A1AA] uppercase whitespace-nowrap">
                                {section.code}
                            </span>
                            <div className="hidden md:block flex-1 h-px bg-zinc-900" />
                            <h2 className="text-sm font-medium tracking-[0.1em] uppercase text-white whitespace-nowrap">
                                {section.title}
                            </h2>
                        </div>
                        <div className="border-l border-zinc-900 pl-6 ml-1">
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
