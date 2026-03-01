import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
    return NextResponse.json({ status: 'ok', message: 'Edge API is functioning correctly' }, { status: 200 });
}
