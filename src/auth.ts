export const runtime = "edge";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const validEmail = process.env.ADMIN_EMAIL;
                    const validPassword = process.env.ADMIN_PASSWORD;

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
