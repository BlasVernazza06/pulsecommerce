"use client";

import { useState, useEffect } from "react";
import { AuthProvider } from "@/context/auth-context";
import { Sidebar, type NavTabId } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<NavTabId>("home");

  // apps/web/app/page.tsx
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Interceptamos F1 para evitar la ayuda del navegador y navegar a Home/Terminal
      if (e.key === "F1") {
        e.preventDefault(); // 👈 Clave para anular el Brave Helper
        setActiveTab("home");
      }

      // Podés mapear aquí otras teclas de función del POS (F2, F3, F4, etc.)
    };

    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, []);
  return (
    <AuthProvider>
      {/* ─── MARCO EXTERIOR (Grisáceo Outer Frame #09090b con padding uniforme) ─── */}
      <div className="flex h-screen w-screen bg-[#09090b] p-3 gap-3 overflow-hidden select-none font-sans">
        {/* ─── SIDEBAR DESACOPLADO ─── */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* ─── CONTENIDO PRINCIPAL DINÁMICO ─── */}
        <MainContent activeTab={activeTab} onNavigate={setActiveTab} />
      </div>
    </AuthProvider>
  );
}
