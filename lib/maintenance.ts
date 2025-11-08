import { getDatabase } from "@/lib/db";
import { MAINTENANCE_SECTIONS } from "@/constants/maintenance";

const COLLECTION_NAME = "maintenance_settings";

export interface MaintenanceSetting {
  section: string;
  isActive: boolean;
  message?: string;
  updatedAt?: string;
  updatedBy?: string;
}

function normalizeSetting(doc: any): MaintenanceSetting {
  return {
    section: doc.section,
    isActive: !!doc.isActive,
    message: doc.message || "",
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString?.() ?? doc.updatedAt : undefined,
    updatedBy: doc.updatedBy || undefined,
  };
}

export async function getMaintenanceSettings(): Promise<MaintenanceSetting[]> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const docs = await collection.find({}).toArray();
  const settingsMap = new Map<string, MaintenanceSetting>();

  docs.forEach((doc) => {
    settingsMap.set(doc.section, normalizeSetting(doc));
  });

  MAINTENANCE_SECTIONS.forEach((section) => {
    if (!settingsMap.has(section.id)) {
      settingsMap.set(section.id, {
        section: section.id,
        isActive: false,
        message: section.defaultMessage,
      });
    }
  });

  return Array.from(settingsMap.values());
}

export async function getMaintenanceStatus(section: string): Promise<MaintenanceSetting> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const doc = await collection.findOne({ section });

  if (!doc) {
    const defaultConfig = MAINTENANCE_SECTIONS.find((item) => item.id === section);
    return {
      section,
      isActive: false,
      message: defaultConfig?.defaultMessage || "",
    };
  }

  return normalizeSetting(doc);
}

export async function isMaintenanceActive(section: string): Promise<MaintenanceSetting | null> {
  const status = await getMaintenanceStatus(section);
  return status.isActive ? status : null;
}

export async function upsertMaintenanceSetting(
  section: string,
  {
    isActive,
    message,
    updatedBy,
  }: {
    isActive: boolean;
    message?: string;
    updatedBy?: string;
  }
): Promise<MaintenanceSetting> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const now = new Date();

  const { value } = await collection.findOneAndUpdate(
    { section },
    {
      $set: {
        section,
        isActive,
        message: message ?? "",
        updatedAt: now,
        updatedBy: updatedBy || "system",
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  return normalizeSetting(value ?? { section, isActive, message, updatedAt: now, updatedBy });
}
