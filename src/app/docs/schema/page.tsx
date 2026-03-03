export const runtime = "edge";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "D1 Schema Reference — ShotByHamadi",
    description: "Cloudflare D1 SQL database schema reference.",
};

const tables = [
    {
        name: "Services",
        description: "Stores all bookable services displayed on the /services page and managed via the Admin Dashboard.",
        columns: [
            { name: "id", type: "INTEGER", pk: true, default: "AUTOINCREMENT" },
            { name: "title", type: "TEXT", pk: false, default: "-" },
            { name: "description", type: "TEXT", pk: false, default: "-" },
            { name: "price", type: "REAL", pk: false, default: "-" },
            { name: "features", type: "TEXT", pk: false, default: "[] (JSON Array)" },
            { name: "category", type: "TEXT", pk: false, default: "-" },
            { name: "travel_fee", type: "REAL", pk: false, default: "0" },
            { name: "policy_note", type: "TEXT", pk: false, default: "-" },
            { name: "is_active", type: "INTEGER", pk: false, default: "1 (Boolean)" },
        ],
    },
    {
        name: "Projects",
        description: "Stores client project references mapped to R2 buckets, authenticating secure Client Portals.",
        columns: [
            { name: "id", type: "TEXT", pk: true, default: "UUID" },
            { name: "project_code", type: "TEXT", pk: false, default: "UNIQUE (6-chars)" },
            { name: "client_name", type: "TEXT", pk: false, default: "-" },
            { name: "client_email", type: "TEXT", pk: false, default: "-" },
            { name: "created_at", type: "DATETIME", pk: false, default: "CURRENT_TIMESTAMP" },
            { name: "folder_path", type: "TEXT", pk: false, default: "R2 Prefix String" },
            { name: "location", type: "TEXT", pk: false, default: "-" },
            { name: "project_password", type: "TEXT", pk: false, default: "NULLABLE" },
            { name: "base_price", type: "REAL", pk: false, default: "0" },
            { name: "travel_surcharge", type: "REAL", pk: false, default: "0" },
            { name: "notes", type: "TEXT", pk: false, default: "NULLABLE" },
        ],
    }
];

export default function SchemaDocsPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12 border-b border-zinc-900 pb-10">
                <div className="flex items-center gap-4 mb-3">
                    <p className="font-mono text-[9px] tracking-[0.4em] text-zinc-600 uppercase">03_DATABASE / D1 Schema Reference</p>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5">SQL / Edge</span>
                </div>
                <h1 className="text-4xl font-light tracking-[0.12em] uppercase text-white mb-4">
                    D1 Schema Reference
                </h1>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mt-4">
                    The ShotByHamadi platform utilizes Cloudflare D1 (SQLite) at the edge for ultra-low latency data retrieval.
                    This documentation outlines the core production database schema.
                </p>
            </div>

            {/* Content Sections */}
            <div className="flex flex-col gap-16">
                {tables.map((table) => (
                    <div key={table.name} className="scroll-mt-28">
                        <h2 className="text-2xl font-light tracking-[0.1em] text-white mb-2">
                            {table.name}
                        </h2>
                        <p className="text-sm text-zinc-500 mb-6">{table.description}</p>

                        <div className="overflow-x-auto border border-zinc-900">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#0a0a0a] text-[10px] tracking-widest uppercase text-zinc-500 font-mono border-b border-zinc-900">
                                    <tr>
                                        <th className="px-6 py-4 font-normal">Column</th>
                                        <th className="px-6 py-4 font-normal">Type</th>
                                        <th className="px-6 py-4 font-normal">Primary Key</th>
                                        <th className="px-6 py-4 font-normal">Default / Note</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-900 bg-black">
                                    {table.columns.map((col) => (
                                        <tr key={col.name} className="hover:bg-zinc-900/40 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-white">
                                                {col.name}
                                            </td>
                                            <td className="px-6 py-4 text-emerald-500/80 font-mono text-xs">
                                                {col.type}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                {col.pk ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-500/80">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80"></span> Yes
                                                    </span>
                                                ) : "No"}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500 font-mono text-[10px] tracking-wider">
                                                {col.default}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
