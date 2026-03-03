"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials. Access denied.");
            setLoading(false);
        } else {
            // Successful login — navigate to admin dashboard
            window.location.href = "/admin";
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 selection:bg-[#A1A1AA] selection:text-black font-sans">
            <div className="w-full max-w-sm border border-zinc-900 p-8 shadow-2xl shadow-black/50">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-white mb-2">System Access</h1>
                    <p className="text-[#A1A1AA] text-[9px] tracking-[0.4em] uppercase">ShotByHamadi Media</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="ADMIN EMAIL"
                            required
                            className="w-full bg-transparent border-b border-zinc-900 px-4 py-3 text-center text-xs tracking-widest text-white placeholder-zinc-800 focus:outline-none focus:border-[#A1A1AA] transition-all duration-300 mb-6"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="ENTER SECURE KEY"
                            required
                            className="w-full bg-transparent border-b border-zinc-900 px-4 py-3 text-center text-xs tracking-widest text-white placeholder-zinc-800 focus:outline-none focus:border-[#A1A1AA] transition-all duration-300"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] uppercase tracking-widest text-center mt-2 font-bold">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#A1A1AA] text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 border border-transparent hover:border-white shadow-lg disabled:opacity-50 disabled:cursor-wait"
                    >
                        {loading ? "Authenticating..." : "Authenticate"}
                    </button>
                </form>
            </div>
        </div>
    );
}
