export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Create a unique clean filename
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

        console.log("Target Bucket:", process.env.R2_BUCKET_NAME);

        await S3.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME || "shotbyhamadi-media",
                Key: fileName,
                Body: buffer,
                ContentType: file.type || "application/octet-stream",
            })
        );

        return NextResponse.json({ success: true, fileName });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}
