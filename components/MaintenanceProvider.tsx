"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { MaintenanceSetting } from "@/lib/maintenance";
import { MAINTENANCE_SECTIONS } from "@/constants/maintenance";

interface MaintenanceContextValue {
  settings: Record<string, MaintenanceSetting>;
  loading: boolean;
  refresh: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextValue | undefined>(undefined);

async function fetchMaintenance(): Promise<Record<string, MaintenanceSetting>> {
  const response = await fetch("/api/maintenance", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load maintenance settings");
  }
  const data = await response.json();
  const settingsArray: MaintenanceSetting[] = data.settings || [];
  return settingsArray.reduce<Record<string, MaintenanceSetting>>((acc, setting) => {
    acc[setting.section] = setting;
    return acc;
  }, {});
}

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, MaintenanceSetting>>({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchMaintenance();
      setSettings(result);
    } catch (error) {
      console.error("Failed to refresh maintenance settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const value = useMemo(() => ({ settings, loading, refresh }), [settings, loading, refresh]);

  const siteMaintenance = settings["whole_site"];
  const isSiteDown = siteMaintenance?.isActive;
  const siteMessage = siteMaintenance?.message || MAINTENANCE_SECTIONS.find((s) => s.id === "whole_site")?.defaultMessage;

  const isAdminRoute = Boolean(pathname && pathname.startsWith("/admin"));
  const hasAdminAccessOverride = Boolean(
    pathname === "/login" && searchParams?.get("admin-access") === "1"
  );

  const shouldShowOverlay = Boolean(
    isSiteDown && !(isAdminRoute || hasAdminAccessOverride)
  );

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
      {shouldShowOverlay && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white px-6 text-center">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Scheduled Maintenance
            </div>
            <h1 className="text-3xl font-bold text-gray-900">We&rsquo;ll be right back.</h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {siteMessage || "GroupXam is temporarily unavailable while we complete some improvements. Thanks for your patience!"}
            </p>
            <p className="text-sm text-gray-400">Our team is working to restore access as quickly as possible.</p>
          </div>
        </div>
      )}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenanceContext() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenanceContext must be used within a MaintenanceProvider");
  }
  return context;
}
