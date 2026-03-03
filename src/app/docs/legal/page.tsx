export const runtime = "edge";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Master Service Agreement — ShotByHamadi",
    description: "The governing legal terms for all ShotByHamadi Media photography and videography sessions.",
};

const sections = [
    {
        id: "01",
        code: "01_ASSET_RETENTION",
        title: "Asset Retention & Recovery",
        clauses: [
            {
                label: "Hosting Period",
                text: "All project assets are hosted on your secure client portal for exactly 30 calendar days from the date of delivery.",
            },
            {
                label: "Automatic Purge",
                text: "On the 31st day, the gallery is automatically purged from the live server. ShotByHamadi Media does not guarantee backups beyond this window.",
            },
            {
                label: "Recovery Attempt Fee",
                text: "If assets are not downloaded within 30 days, a $30 non-refundable Recovery Attempt Fee is required to search offline archives.",
            },
            {
                label: "No Guarantee",
                text: "Payment of the fee covers the labor of the search and does not guarantee image recovery if they have been purged from the master database.",
            },
        ],
    },
    {
        id: "02",
        code: "02_TRAVEL_PRICING",
        title: "Travel Boundaries & Custom Pricing",
        clauses: [
            {
                label: "Local Service Area",
                text: "Sessions located within Chattanooga, TN, or within a documented 30-minute drive of the city center, are considered local and carry no travel surcharge.",
            },
            {
                label: "Extended Travel",
                text: "Any session exceeding the 30-minute travel radius is subject to Custom Travel Pricing based on mileage and logistical overhead.",
            },
            {
                label: "Travel Retainers",
                text: "For all Extended Travel sessions, a non-refundable 50% retainer is mandatory at the time of booking to secure the date.",
            },
        ],
    },
    {
        id: "03",
        code: "03_CONDUCT_POLICY",
        title: "Conduct & Late Policy",
        clauses: [
            {
                label: "Grace Period",
                text: "A strict 15-minute grace period is provided for all sessions.",
            },
            {
                label: "Time Deduction",
                text: "Arrivals after 15 minutes will have that time deducted from the total session duration without a price adjustment.",
            },
            {
                label: "Automatic Cancellation",
                text: "Arrivals exceeding 30 minutes late constitute a \"No-Show,\" resulting in immediate session termination and forfeiture of all fees paid.",
            },
        ],
    },
    {
        id: "04",
        code: "04_DELIVERY_CONTROL",
        title: "Delivery & Artistic Control",
        clauses: [
            {
                label: "Turnaround Time",
                text: "Final edited high-resolution assets will be delivered via your branded client portal within 1–7 business days.",
            },
            {
                label: "Artistic Discretion",
                text: "The Photographer maintains absolute authority over image selection and the editing process.",
            },
            {
                label: "Post-Processing Prohibition",
                text: "Clients are strictly prohibited from applying external filters or performing independent editing on delivered files.",
            },
            {
                label: "RAW Assets",
                text: "RAW/Unedited files are proprietary property and are never released under any circumstances.",
            },
        ],
    },
    {
        id: "05",
        code: "05_USAGE_RIGHTS",
        title: "Usage & Commercial Rights",
        clauses: [
            {
                label: "Personal Use License",
                text: "You are granted a non-exclusive license for personal printing, social media posting, and personal archiving.",
            },
            {
                label: "Commercial Restriction",
                text: "Use for paid advertising, brand partnerships, or third-party resale is prohibited without a separate Commercial Licensing Agreement.",
            },
        ],
    },
];

export default function LegalPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12 border-b border-zinc-900 pb-10">
                <p className="font-mono text-[9px] tracking-[0.4em] text-zinc-600 uppercase mb-3">01_LEGAL / Master Service Agreement</p>
                <h1 className="text-4xl font-light tracking-[0.12em] uppercase text-white mb-4">
                    Master Service Agreement
                </h1>
                <p className="text-zinc-500 text-xs font-mono">Last Updated: March 3, 2026 &nbsp;·&nbsp; Effective Immediately</p>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mt-4">
                    This agreement governs all photography and videography services provided by ShotByHamadi Media.
                    By booking a session, the client acknowledges and accepts all terms below in their entirety.
                </p>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-14">
                {sections.map((section) => (
                    <div key={section.id} id={`section-${section.id}`} className="scroll-mt-28">
                        {/* Section Header */}
                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="font-mono text-[10px] tracking-[0.35em] text-[#A1A1AA] uppercase flex-shrink-0">
                                {section.code}
                            </span>
                            <div className="flex-1 h-px bg-zinc-900" />
                        </div>
                        <h2 className="text-xl font-light tracking-[0.15em] uppercase text-white mb-6">
                            {section.title}
                        </h2>

                        {/* Clauses */}
                        <div className="flex flex-col gap-0 border border-zinc-900">
                            {section.clauses.map((clause, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-1 md:grid-cols-[180px_1fr] border-b border-zinc-900/60 last:border-b-0"
                                >
                                    <div className="px-5 py-4 border-b md:border-b-0 md:border-r border-zinc-900/60 bg-zinc-900/20">
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA] leading-snug">{clause.label}</p>
                                    </div>
                                    <div className="px-5 py-4">
                                        <p className="text-sm text-zinc-300 leading-relaxed">{clause.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer note */}
            <div className="mt-16 pt-8 border-t border-zinc-900">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                    ShotByHamadi Media &nbsp;·&nbsp; Chattanooga, TN &nbsp;·&nbsp; contact@shotbyhamadi.com
                </p>
            </div>
        </div>
    );
}
