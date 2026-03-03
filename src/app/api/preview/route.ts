export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { AwsClient } from "aws4fetch";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json({ error: "No key provided" }, { status: 400 });
        }

        const aws = new AwsClient({
            accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
            service: "s3",
            region: "auto",
        });

        const bucket = process.env.R2_BUCKET_NAME || "shotbyhamadi-media";
        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`;

        const response = await aws.fetch(endpoint, {
            method: "GET"
        });

        if (!response.ok) {
            console.error("Fetch failed", response.status, await response.text());
            throw new Error(`Failed to read image stream. Status: ${response.status}`);
        }

        // Return the raw stream (very memory efficient on Edge)
        const headers = new Headers(response.headers);
        headers.set("Cache-Control", "public, max-age=86400");

        return new NextResponse(response.body, {
            status: response.status,
            headers
        });

    } catch (error) {
        console.error("Preview Proxy Error:", error);
        return NextResponse.json({ error: "Failed to generate preview." }, { status: 500 });
    }
}
