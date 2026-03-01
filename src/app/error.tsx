"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Boundary caught an exception:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 font-sans text-center">
            <div className="max-w-md border border-zinc-900 p-10 bg-zinc-900/10">
                <h2 className="text-xl font-light tracking-[0.2em] uppercase text-white mb-4">Service Temporarily Unavailable</h2>
                <p className="text-zinc-500 text-xs tracking-widest uppercase mb-8 leading-relaxed">
                    The system encountered an unexpected fault communicating with the data layer.
                </p>
                <div className="bg-black border border-red-900/50 p-4 mb-8">
                    <code className="text-red-500 text-[10px]">
                        {error.message || "Unknown Edge Runtime Error"}
                    </code>
                </div>
                <button
                    onClick={() => reset()}
                    className="bg-[#A1A1AA] text-black px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300"
                >
                    Attempt Recovery
                </button>
            </div>
        </div>
    );
}
