import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const startTime = Date.now();
    // Lightweight query that exercises the PostgreSQL connection on Supabase
    const categoryCount = await prisma.category.count();
    const durationMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "alive",
        database: "connected",
        categoryCount,
        durationMs,
        timestamp: new Date().toISOString(),
        message: "Supabase database keep-alive ping successful",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Keep-Alive Cron] Database ping failed:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
