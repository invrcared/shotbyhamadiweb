export const runtime = "edge";
export const dynamic = "force-dynamic";

export const config = {
    api: {
        bodyParser: false,
        sizeLimit: '100mb',
    },
};

import { NextRequest, NextResponse } from "next/server";
import { AwsClient } from "aws4fetch";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        // Create a unique clean filename
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

        const bucket = process.env.R2_BUCKET_NAME || "shotbyhamadi-media";
        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${fileName}`;

        console.log("Target Bucket:", bucket);

        // Uses lightweight aws4fetch instead of the bloated node-dependent AWS SDK
        const aws = new AwsClient({
            accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
            service: "s3",
            region: "auto",
        });

        const uploadRes = await aws.fetch(endpoint, {
            method: "PUT",
            body: buffer,
            headers: {
                "Content-Type": file.type || "application/octet-stream",
            }
        });

        if (!uploadRes.ok) {
            const errText = await uploadRes.text();
            throw new Error(`R2 Response (${uploadRes.status}): ${errText}`);
        }

        return NextResponse.json({ success: true, fileName });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to upload file." }, { status: 500 });
    }
}
