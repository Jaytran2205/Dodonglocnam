import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 300;

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: { [key: string]: string } = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json(
      { success: true, settings: settingsMap },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Public GET Settings Error:", error);
    return NextResponse.json({ success: false, settings: {} }, { status: 500 });
  }
}
