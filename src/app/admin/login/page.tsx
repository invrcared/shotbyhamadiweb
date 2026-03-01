import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const error = searchParams?.error;

    async function handleLogin(formData: FormData) {
        "use server";
        try {
            await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/admin",
            });
        } catch (err) {
            if (err instanceof AuthError) {
                if (err.type === "CredentialsSignin") {
                    redirect("/admin/login?error=InvalidCredentials");
                }
                redirect("/admin/login?error=AuthError");
            }
            throw err;
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 selection:bg-[#A1A1AA] selection:text-black font-sans">
            <div className="w-full max-w-sm border border-zinc-900 p-8 shadow-2xl shadow-black/50">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-white mb-2">System Access</h1>
                    <p className="text-[#A1A1AA] text-[9px] tracking-[0.4em] uppercase">ShotByHamadi Media</p>
                </div>

                <form action={handleLogin} className="space-y-8">
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
                            Access Denied
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#A1A1AA] text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 border border-transparent hover:border-white shadow-lg"
                    >
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}
