import { handlers } from "@/auth";

export const runtime = "edge";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const GET = handlers.GET as any;
export const POST = handlers.POST as any;
