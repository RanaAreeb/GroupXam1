import { NextResponse } from "next/server";
import { getMaintenanceSettings } from "@/lib/maintenance";

export async function GET() {
  try {
    const settings = await getMaintenanceSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Failed to fetch maintenance settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load maintenance settings." },
      { status: 500 }
    );
  }
}
