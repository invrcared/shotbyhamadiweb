import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

// In-memory rate limiting (per isolate — good enough for edge)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // max actions per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
}

// Challenge store (short-lived, per isolate)
const challengeStore = new Map<string, { albumId: number; createdAt: number }>();
const CHALLENGE_TTL = 120_000; // 2 minutes
const DIFFICULTY = 4; // SHA-256 hash must start with 4 zeros

function cleanupChallenges() {
    const now = Date.now();
    for (const [key, val] of challengeStore) {
        if (now - val.createdAt > CHALLENGE_TTL) challengeStore.delete(key);
    }
}

/** GET — Issue a proof-of-work challenge */
export async function GET(req: Request) {
    const url = new URL(req.url);
    const albumId = url.searchParams.get("albumId");
    if (!albumId) return NextResponse.json({ error: "albumId required" }, { status: 400 });

    cleanupChallenges();

    // Generate random challenge
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const challenge = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    challengeStore.set(challenge, { albumId: Number(albumId), createdAt: Date.now() });

    return NextResponse.json({ challenge, difficulty: DIFFICULTY });
}

/** Verify proof-of-work solution */
async function verifyPoW(challenge: string, nonce: number, difficulty: number): Promise<boolean> {
    const input = challenge + nonce;
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hex.startsWith('0'.repeat(difficulty));
}

/** POST — Record a view or like */
export async function POST(req: Request) {
    try {
        // Basic bot checks
        const ua = req.headers.get("user-agent") || "";
        const accept = req.headers.get("accept") || "";
        if (!ua || ua.length < 10 || !accept) {
            return NextResponse.json({ error: "Invalid request" }, { status: 403 });
        }

        // Rate limit by IP
        const ip = req.headers.get("cf-connecting-ip") ||
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json({ error: "Rate limited" }, { status: 429 });
        }

        const body = await req.json() as {
            albumId: number;
            action: string;
            fingerprint: string;
            challenge: string;
            nonce: number;
        };

        const { albumId, action, fingerprint, challenge, nonce } = body;

        // Validate inputs
        if (!albumId || !action || !fingerprint || !challenge || nonce === undefined) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        if (action !== "view" && action !== "like") {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
        if (typeof fingerprint !== "string" || fingerprint.length < 16) {
            return NextResponse.json({ error: "Invalid fingerprint" }, { status: 400 });
        }

        // Verify challenge exists and matches album
        const stored = challengeStore.get(challenge);
        if (!stored || stored.albumId !== albumId) {
            return NextResponse.json({ error: "Invalid or expired challenge" }, { status: 403 });
        }

        // Verify proof-of-work
        const valid = await verifyPoW(challenge, nonce, DIFFICULTY);
        if (!valid) {
            return NextResponse.json({ error: "PoW verification failed" }, { status: 403 });
        }

        // Consume challenge (one-time use)
        challengeStore.delete(challenge);

        const d1 = getRequestContext().env.shotbyhamadi_db;

        // Check if this fingerprint already performed this action on this album
        const existing = await d1.prepare(
            "SELECT id FROM AlbumEngagement WHERE album_id = ? AND fingerprint = ? AND action = ?"
        ).bind(albumId, fingerprint, action).first();

        if (existing) {
            // Already recorded — return current counts without incrementing
            const album = await d1.prepare(
                "SELECT view_count, like_count FROM Albums WHERE id = ?"
            ).bind(albumId).first() as { view_count: number; like_count: number } | null;

            return NextResponse.json({
                success: true,
                already: true,
                view_count: album?.view_count || 0,
                like_count: album?.like_count || 0,
            });
        }

        // Record engagement and increment counter in a batch
        const countColumn = action === "view" ? "view_count" : "like_count";

        await d1.batch([
            d1.prepare(
                "INSERT INTO AlbumEngagement (album_id, fingerprint, action) VALUES (?, ?, ?)"
            ).bind(albumId, fingerprint, action),
            d1.prepare(
                `UPDATE Albums SET ${countColumn} = ${countColumn} + 1 WHERE id = ?`
            ).bind(albumId),
        ]);

        // Fetch updated counts
        const album = await d1.prepare(
            "SELECT view_count, like_count FROM Albums WHERE id = ?"
        ).bind(albumId).first() as { view_count: number; like_count: number } | null;

        return NextResponse.json({
            success: true,
            already: false,
            view_count: album?.view_count || 0,
            like_count: album?.like_count || 0,
        });
    } catch (error) {
        console.error("Engagement error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Server error" },
            { status: 500 }
        );
    }
}
