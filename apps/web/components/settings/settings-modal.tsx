"use client";

import * as React from "react";
import {
  Store,
  Printer,
  DollarSign,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  X,
  Check,
} from "lucide-react";
import { GeneralTab } from "./sections/general-tab";
import { HardwareTab } from "./sections/hardware-tab";
import { PricingTab } from "./sections/pricing-tab";
import { AiTab } from "./sections/ai-tab";
import { SecurityTab } from "./sections/security-tab";
import { SyncTab } from "./sections/sync-tab";
import { Badge, Button } from "@pulsecommerce/ui";

export type SettingsTabId =
  | "general"
  | "hardware"
  | "pricing"
  | "ai"
  | "security"
  | "sync";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: SettingsTabId;
}

const TABS: Array<{
  id: SettingsTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}> = [
  { id: "general", label: "General", icon: Store },
  { id: "hardware", label: "Hardware & POS", icon: Printer },
  { id: "pricing", label: "Precios & Fiscal", icon: DollarSign },
  { id: "ai", label: "IA & Voice POS", icon: Sparkles, badge: "HITL" },
  { id: "security", label: "Caja & Seguridad", icon: ShieldCheck },
  { id: "sync", label: "Offline & Sync", icon: RefreshCw },
];

export function SettingsModal({
  isOpen,
  onClose,
  defaultTab = "general",
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>(defaultTab);
  const [isSaved, setIsSaved] = React.useState(false);

  // Sincronizar defaultTab si cambia al abrir
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setIsSaved(false);
    }
  }, [isOpen, defaultTab]);

  // Manejar tecla Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      <div className="w-full max-w-4xl h-[600px] bg-[#0c0c0e] border border-white/[0.12] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-row animate-in zoom-in-95 duration-150 relative">
        
        {/* ─── SIDEBAR DE PESTAÑAS (Izquierda) ─── */}
        <aside className="w-60 bg-zinc-950/70 p-4 border-r border-white/[0.08] flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Ajustes del Sistema
              </span>
            </div>

            <nav className="space-y-1" role="tablist">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-white/[0.12] text-white font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? "text-white" : "text-zinc-400"
                        }`}
                      />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    {tab.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/[0.06] text-zinc-400"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          
        </aside>

        {/* ─── CONTENIDO DINÁMICO (Derecha) ─── */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
          {/* Header Superior */}
          <header className="h-14 px-8 border-b border-white/[0.06] flex items-center justify-between bg-black/20 shrink-0">
            <span id="settings-dialog-title" className="text-xs font-medium text-zinc-400">
              PulseCommerce &bull; Configuración Operativa
            </span>

            <button
              type="button"
              onClick={onClose}
              className="h-7 w-7 rounded-lg inline-flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Área con Scroll de la Pestaña Activa */}
          <div className="flex-1 p-8 pb-36 overflow-y-auto no-scrollbar">
            {activeTab === "general" && <GeneralTab />}
            {activeTab === "hardware" && <HardwareTab />}
            {activeTab === "pricing" && <PricingTab />}
            {activeTab === "ai" && <AiTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "sync" && <SyncTab />}
          </div>

          {/* Footer con Botones de Acción */}
          <footer className="h-14 px-8 border-t border-white/[0.06] flex items-center justify-end gap-3 bg-black/40 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-4 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar (Esc)
            </button>
            <Button
              type="button"
              onClick={handleSave}
              className="h-8 px-4 text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm gap-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[2.5] text-emerald-600" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </Button>
          </footer>
        </main>
      </div>
    </div>
  );
}
