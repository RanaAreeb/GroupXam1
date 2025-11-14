import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getMaintenanceSettings, upsertMaintenanceSetting } from "@/lib/maintenance";
import { MAINTENANCE_SECTIONS } from "@/constants/maintenance";

const ADMIN_EMAILS = ["ranaareeb1029@gmail.com", "cliftonmanneh6@gmail.com", " jtdavis@konductcoachlearning.com"];

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { email?: string };
    if (decoded?.email && ADMIN_EMAILS.includes(decoded.email)) {
      return decoded.email;
    }
  } catch (error) {
    console.error("Admin verification failed:", error);
  }
  return null;
}

export async function GET(request: NextRequest) {
  const adminEmail = await requireAdmin(request);
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getMaintenanceSettings();
    return NextResponse.json({ success: true, settings, sections: MAINTENANCE_SECTIONS });
  } catch (error: any) {
    console.error("Failed to fetch maintenance settings:", error);
    return NextResponse.json({ success: false, error: "Failed to load maintenance settings." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminEmail = await requireAdmin(request);
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { section, isActive, message } = await request.json();

    if (!section) {
      return NextResponse.json({ success: false, error: "Section is required." }, { status: 400 });
    }

    const normalizedIsActive = Boolean(isActive);
    const trimmedMessage = typeof message === "string" ? message.trim() : undefined;

    const updatedSetting = await upsertMaintenanceSetting(section, {
      isActive: normalizedIsActive,
      message: trimmedMessage,
      updatedBy: adminEmail,
    });

    return NextResponse.json({ success: true, setting: updatedSetting });
  } catch (error: any) {
    console.error("Failed to update maintenance setting:", error);
    return NextResponse.json({ success: false, error: "Failed to update maintenance setting." }, { status: 500 });
  }
}
