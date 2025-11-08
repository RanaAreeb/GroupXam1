"use client";

import { useMemo } from "react";
import { useMaintenanceContext } from "@/components/MaintenanceProvider";
import type { MaintenanceSetting } from "@/lib/maintenance";

export function useMaintenance(section?: string) {
  const { settings, loading, refresh } = useMaintenanceContext();

  const setting: MaintenanceSetting | undefined = useMemo(() => {
    if (!section) return undefined;
    return settings[section];
  }, [section, settings]);

  return {
    maintenance: setting,
    settings,
    loading,
    refresh,
  };
}
