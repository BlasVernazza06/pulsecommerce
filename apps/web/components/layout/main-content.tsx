"use client";

import * as React from "react";
import { type NavTabId } from "@/components/layout/sidebar";
import { Can } from "@/components/auth/can";
import { AccessDenied } from "@/components/auth/access-denied";
import { TerminalView } from "@/components/views/terminal-view";
import { AnalyticsView } from "@/components/views/analytics-view";
import { CustomersView } from "@/components/views/customers-view";
import { InventoryView } from "@/components/views/inventory-view";
import { TreasuryView } from "@/components/views/treasury-view";
import { SettingsView } from "@/components/views/settings-view";
import { HelpView } from "@/components/views/help-view";

export interface MainContentProps {
  /** Pestaña o ruta actualmente activa */
  activeTab: NavTabId;
  /** Callback para cambiar la pestaña activa */
  onNavigate: (tab: NavTabId) => void;
}

/**
 * `<MainContent />` Componente contenedor del área principal del POS.
 * Renderiza de forma dinámica la vista activa protegiendo cada pantalla con RBAC.
 */
export function MainContent({ activeTab, onNavigate }: MainContentProps) {
  const fallback = <AccessDenied onReset={() => onNavigate("home")} />;

  return (
    <main className="flex-1 flex flex-col bg-[#09090b] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
      {activeTab === "home" && <TerminalView />}

      {activeTab === "analytics" && (
        <Can roles={["OWNER", "MANAGER"]} fallback={fallback}>
          <AnalyticsView />
        </Can>
      )}

      {activeTab === "customers" && (
        <Can roles={["OWNER", "MANAGER", "CASHIER"]} fallback={fallback}>
          <CustomersView />
        </Can>
      )}

      {activeTab === "stock" && (
        <Can roles={["OWNER", "MANAGER", "STOCK_CLERK"]} fallback={fallback}>
          <InventoryView />
        </Can>
      )}

      {activeTab === "payouts" && (
        <Can roles={["OWNER", "MANAGER", "CASHIER"]} fallback={fallback}>
          <TreasuryView />
        </Can>
      )}

      {activeTab === "settings" && (
        <Can roles={["OWNER", "MANAGER"]} fallback={fallback}>
          <SettingsView />
        </Can>
      )}

      {activeTab === "help" && <HelpView />}
    </main>
  );
}
