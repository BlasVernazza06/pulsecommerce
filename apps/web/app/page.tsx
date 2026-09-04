"use client";

import { useState } from "react";
import { AuthProvider } from "@/context/auth-context";
import { Sidebar, type NavTabId } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<NavTabId>("home");

  return (
    <AuthProvider>
      {/* ─── MARCO EXTERIOR (Pitch Black Outer Frame con padding uniforme) ─── */}
      <div className="flex h-screen w-screen bg-black p-3 gap-3 overflow-hidden select-none font-sans">
        {/* ─── SIDEBAR DESACOPLADO ─── */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* ─── CONTENIDO PRINCIPAL DINÁMICO ─── */}
        <MainContent activeTab={activeTab} onNavigate={setActiveTab} />
      </div>
    </AuthProvider>
  );
}
