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
            window.location.href = "/admin";
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-sm glass rounded-xl p-8 shadow-2xl shadow-black/50">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
                        <svg className="w-7 h-7 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-[var(--font-outfit)] font-light tracking-[0.2em] uppercase text-white mb-2">System Access</h1>
                    <p className="text-zinc-500 text-[9px] tracking-[0.4em] uppercase">ShotByHamadi Media</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="email"
                            placeholder="USERNAME"
                            required
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3.5 text-center text-xs tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-[#8b5cf6]/50 transition-all duration-300"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="ENTER SECURE KEY"
                            required
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3.5 text-center text-xs tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-[#8b5cf6]/50 transition-all duration-300"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-[10px] uppercase tracking-widest text-center font-bold animate-fade-in">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-gradient py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all"
                    >
                        {loading ? "Authenticating..." : "Authenticate"}
                    </button>
                </form>
            </div>
        </div>
    );
}
