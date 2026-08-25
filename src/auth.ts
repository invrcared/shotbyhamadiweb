export const runtime = "edge";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: "sbh-media-secret-key-2026",
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const validEmail = "hamham";
                    const validPassword = "thenationofSBH123";

                    if (
                        credentials?.email === validEmail &&
                        credentials?.password === validPassword
                    ) {
                        return { id: "admin", name: "Administrator", email: validEmail };
                    }
                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
});
