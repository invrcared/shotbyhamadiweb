import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#A1A1AA] selection:text-black font-sans pb-32">
            <header className="sticky top-0 z-50 w-full bg-[#000000]/80 backdrop-blur-md border-b border-zinc-900/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image src="/white-transparent.png" alt="ShotByHamadi Logo" width={150} height={40} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/services" className="text-[10px] uppercase tracking-[0.2em] hover:text-[#A1A1AA] transition-colors">Services</Link>
                        <Link href="/portal" className="text-[10px] uppercase tracking-[0.2em] hover:text-[#A1A1AA] transition-colors">Client Portal</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-20">
                <div className="border border-zinc-900 p-8 md:p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-900/30 blur-[100px] rounded-full group-hover:bg-[#A1A1AA]/10 transition-colors duration-1000 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-4">Terms & Guidelines</h1>
                    <p className="text-[#A1A1AA] tracking-[0.3em] uppercase text-[10px] mb-16 pb-8 border-b border-zinc-900">Last Updated: March 1, 2026</p>

                    <div className="space-y-12">
                        {/* 1. Booking & Travel Pricing */}
                        <section>
                            <h2 className="text-xl tracking-[0.2em] font-light uppercase mb-6 text-white flex items-center gap-4">
                                <span className="text-[#A1A1AA]">01.</span> Booking & Travel Pricing
                            </h2>
                            <div className="space-y-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed pl-10 border-l border-zinc-900 ml-[11px]">
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Local Service Area:</strong> Sessions within Chattanooga, TN, or within a 30-minute drive of the city center, are considered local and do not require a deposit.</p>
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Extended Travel:</strong> Any session exceeding a 30-minute travel time is subject to <span className="text-white font-bold underline decoration-[#A1A1AA] underline-offset-4">Custom Travel Pricing</span>. Fees will be quoted based on total travel time and logistical requirements.</p>
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Retainers:</strong> For all &quot;Extended Travel&quot; sessions, a non-refundable 50% retainer is required at the time of booking to secure the date.</p>
                            </div>
                        </section>

                        {/* 2. Rescheduling & Cancellations */}
                        <section>
                            <h2 className="text-xl tracking-[0.2em] font-light uppercase mb-6 text-white flex items-center gap-4">
                                <span className="text-[#A1A1AA]">02.</span> Rescheduling & Cancellations
                            </h2>
                            <div className="space-y-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed pl-10 border-l border-zinc-900 ml-[11px]">
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Notice:</strong> A minimum of 48 hours&apos; notice is required to reschedule.</p>
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Weather:</strong> Extreme weather (heavy rain/lightning) for outdoor shoots results in a free reschedule.</p>
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">No-Shows:</strong> Failing to show up without notice forfeits your session and may result in a permanent booking ban.</p>
                            </div>
                        </section>

                        {/* 3. Late Policy */}
                        <section>
                            <h2 className="text-xl tracking-[0.2em] font-light uppercase mb-6 text-white flex items-center gap-4">
                                <span className="text-[#A1A1AA]">03.</span> Late Policy
                            </h2>
                            <div className="space-y-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed pl-10 border-l border-zinc-900 ml-[11px]">
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Grace Period:</strong> 15 minutes.</p>
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Penalty:</strong> After 15 minutes, the time is deducted from your shoot. After 30 minutes, the session is cancelled as a &quot;No-Show.&quot;</p>
                            </div>
                        </section>

                        {/* 4. Creative Control & Delivery */}
                        <section>
                            <h2 className="text-xl tracking-[0.2em] font-light uppercase mb-6 text-white flex items-center gap-4">
                                <span className="text-[#A1A1AA]">04.</span> Creative Control & Delivery
                            </h2>
                            <div className="space-y-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed pl-10 border-l border-zinc-900 ml-[11px]">
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Artistic Discretion:</strong> ShotByHamadi Media maintains full control over editing and image selection. No client re-editing or &quot;raw&quot; file requests are permitted.</p>
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Turnaround:</strong> Final galleries are delivered via your branded portal (<span className="font-mono text-[10px]">shotbyhamadi.com/portal/[slug]</span>) within 7-14 business days.</p>
                            </div>
                        </section>

                        {/* 5. Usage & Rights */}
                        <section>
                            <h2 className="text-xl tracking-[0.2em] font-light uppercase mb-6 text-white flex items-center gap-4">
                                <span className="text-[#A1A1AA]">05.</span> Usage & Rights
                            </h2>
                            <div className="space-y-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed pl-10 border-l border-zinc-900 ml-[11px]">
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">License:</strong> You receive a Personal Use License (print, share, post).</p>
                                <p><strong className="text-white font-medium uppercase text-xs tracking-wider">Commercial:</strong> Any brand or business use requires a separate commercial contract.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="mt-32 border-t border-zinc-900/50 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
                    <p className="text-[#A1A1AA] uppercase tracking-[0.4em] text-[10px] mb-4">ShotByHamadi Media</p>
                    <p className="text-zinc-500 uppercase tracking-widest text-[9px]">Chattanooga, TN • Professional Videography and Photography Services.</p>
                </div>
            </footer>
        </div>
    );
}
