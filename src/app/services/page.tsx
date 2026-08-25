import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

interface Service {
    id: number;
    title: string;
    description: string;
    price: string;
    features: string;
}

export default async function ServicesPage() {
    let results: Service[] = [];
    try {
        const d1 = getRequestContext().env.shotbyhamadi_db;
        const dbResponse = await d1.prepare("SELECT * FROM Services").all();
        results = dbResponse.results as unknown as Service[];
    } catch (err) {
        console.error("D1 Error:", err);
    }

    return (
        <div className="min-h-screen text-white selection:bg-[#8b5cf6]/30 selection:text-white font-sans pb-32">
            <main className="p-8 max-w-5xl mx-auto pt-24">
                <h1 className="text-4xl md:text-5xl font-[var(--font-outfit)] font-light tracking-[0.2em] uppercase mb-4 text-center gradient-text">
                    Our Services
                </h1>
                <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] text-center mb-16">Professional photography & videography packages</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results?.map((service: Service) => (
                        <div key={service.id} className="glass glow-border p-8 rounded-lg transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-2 tracking-wide">{service.title}</h2>
                            <p className="text-2xl mb-4 font-light">
                                <span className="gradient-text font-bold">
                                    {Number(service.price) > 0 ? `$${service.price}` : "Custom Quote"}
                                </span>
                            </p>
                            <p className="text-zinc-400 mb-6 font-light leading-relaxed">{service.description}</p>
                            <ul className="space-y-3">
                                {JSON.parse(service.features || "[]").map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-center text-sm text-zinc-300 gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-16 glass rounded-lg p-8 text-center max-w-2xl mx-auto">
                    <h3 className="text-[#a78bfa] uppercase tracking-[0.3em] text-xs font-bold mb-4">Before You Book</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        No deposits for Chattanooga/30-min radius. Custom quotes apply for travel sessions.
                        Please review our full <a href="/docs/legal" className="text-white underline decoration-[#8b5cf6] underline-offset-4 hover:text-[#a78bfa] transition-colors">Terms & Guidelines</a> or our <a href="/docs" className="text-white underline decoration-[#8b5cf6] underline-offset-4 hover:text-[#a78bfa] transition-colors">Documentation</a> before booking.
                    </p>
                </div>
                <div className="flex justify-center mt-16">
                    <a href="mailto:contact@shotbyhamadi.com" className="btn-outline-glow inline-block uppercase tracking-[0.3em] font-medium py-4 px-12 text-xs rounded-sm">
                        Contact Studio
                    </a>
                </div>
            </main>
        </div>
    );
}
