/**
 * Client-side engagement utilities for album likes & views.
 * Handles browser fingerprinting and proof-of-work challenge solving.
 */

/** Generate a browser fingerprint by hashing multiple signals */
export async function generateFingerprint(): Promise<string> {
    const signals: string[] = [];

    // Navigator signals
    signals.push(navigator.userAgent);
    signals.push(navigator.language);
    signals.push(String(screen.width) + 'x' + String(screen.height));
    signals.push(String(screen.colorDepth));
    signals.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
    signals.push(String(navigator.hardwareConcurrency || 0));

    // Canvas fingerprint
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('SBH.fp', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('SBH.fp', 4, 17);
            signals.push(canvas.toDataURL());
        }
    } catch {
        signals.push('no-canvas');
    }

    const data = new TextEncoder().encode(signals.join('|'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Solve a proof-of-work challenge: find nonce where SHA-256(challenge+nonce) starts with required prefix */
export async function solveChallenge(challenge: string, difficulty: number): Promise<number> {
    const prefix = '0'.repeat(difficulty);
    let nonce = 0;

    while (true) {
        const input = challenge + nonce;
        const data = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hex.startsWith(prefix)) {
            return nonce;
        }
        nonce++;

        // Yield to main thread every 1000 iterations to keep UI responsive
        if (nonce % 1000 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }
}

/** Full engagement flow: get challenge, solve it, submit action */
export async function recordEngagement(
    albumId: number,
    action: 'view' | 'like'
): Promise<{ success: boolean; view_count?: number; like_count?: number; already?: boolean }> {
    try {
        const fingerprint = await generateFingerprint();

        // Get challenge from server
        const challengeRes = await fetch(`/api/albums/engage?albumId=${albumId}`);
        if (!challengeRes.ok) return { success: false };
        const { challenge, difficulty } = await challengeRes.json();

        // Solve proof-of-work
        const nonce = await solveChallenge(challenge, difficulty);

        // Submit engagement
        const res = await fetch('/api/albums/engage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ albumId, action, fingerprint, challenge, nonce }),
        });

        if (!res.ok) return { success: false };
        return await res.json();
    } catch {
        return { success: false };
    }
}
