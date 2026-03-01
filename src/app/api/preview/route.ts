export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json({ error: "No key provided" }, { status: 400 });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME || "shotbyhamadi-media",
            Key: key,
        });

        // 1. Fetch the object directly from S3 instead of sending a redirect URL
        const response = await S3.send(command);

        // 2. Convert the stream to a buffer
        const byteArray = await response.Body?.transformToByteArray();
        if (!byteArray) {
            throw new Error("Failed to read image stream.");
        }

        // 3. Return the exact File Buffer with original headers so Next/Image renders it perfectly as an image source.
        return new NextResponse(Buffer.from(byteArray), {
            headers: {
                "Content-Type": response.ContentType || "image/jpeg",
                "Cache-Control": "public, max-age=86400"
            }
        });

    } catch (error) {
        console.error("Preview Proxy Error:", error);
        return NextResponse.json({ error: "Failed to generate preview." }, { status: 500 });
    }
}
