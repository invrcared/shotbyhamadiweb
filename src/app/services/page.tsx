import { getRequestContext } from "@cloudflare/next-on-pages";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

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
        <div className="min-h-screen bg-[#000000] text-white selection:bg-[#A1A1AA] selection:text-black font-sans pb-32">
            <main className="p-8 max-w-5xl mx-auto pt-24">
                <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] uppercase mb-12 text-center">
                    Our Services
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results?.map((service: Service) => (
                        <div key={service.id} className="border border-zinc-900 p-8 hover:border-zinc-700 transition-colors bg-black">
                            <h2 className="text-2xl font-bold mb-2 tracking-wide">{service.title}</h2>
                            <p className="text-xl text-[#A1A1AA] mb-4 font-light">
                                {Number(service.price) > 0 ? `$${service.price}` : "Custom Quote"}
                            </p>
                            <p className="text-zinc-400 mb-6 font-light">{service.description}</p>
                            <ul className="space-y-2">
                                {JSON.parse(service.features || "[]").map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-center text-sm text-zinc-300">
                                        <span className="w-1.5 h-1.5 bg-[#A1A1AA] rounded-full mr-3"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-16 border border-zinc-900 bg-zinc-900/30 p-8 text-center max-w-2xl mx-auto">
                    <h3 className="text-[#A1A1AA] uppercase tracking-[0.3em] text-xs font-bold mb-4">Before You Book</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        No deposits for Chattanooga/30-min radius. Custom quotes apply for travel sessions.
                        Please review our full <a href="/docs/legal" className="text-white underline decoration-[#A1A1AA] underline-offset-4 hover:text-[#A1A1AA] transition-colors">Terms & Guidelines</a> or our <a href="/docs" className="text-white underline decoration-[#A1A1AA] underline-offset-4 hover:text-[#A1A1AA] transition-colors">Documentation</a> before booking.
                    </p>
                </div>
                <div className="flex justify-center mt-16">
                    <a href="mailto:contact@shotbyhamadi.com" className="inline-block uppercase tracking-[0.3em] font-medium border border-[#A1A1AA] text-white hover:bg-[#A1A1AA] hover:text-black py-4 px-12 transition-all duration-300 active:scale-95 text-xs">
                        Contact Studio
                    </a>
                </div>
            </main>
        </div>
    );
}
