import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: { [key: string]: string } = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (error) {
    console.error("Public GET Settings Error:", error);
    return NextResponse.json({ success: false, settings: {} }, { status: 500 });
  }
}
