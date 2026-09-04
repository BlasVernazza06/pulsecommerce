"use client";

import * as React from "react";
import { Card, Badge } from "@pulsecommerce/ui";
import { HelpCircle, BookOpen, Keyboard, Terminal, Cpu } from "lucide-react";

export function HelpView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b border-white/[0.06] px-6 flex items-center justify-between bg-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Centro de Ayuda & Guía Operativa
          </h2>
          <Badge variant="outline" className="text-[10px] text-zinc-400">
            Documentación POS
          </Badge>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-white/[0.08] bg-card/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Keyboard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Atajos de Teclado del Terminal</h3>
                <p className="text-xs text-zinc-400">Operación 100% sin ratón para máxima velocidad</p>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Buscador global / Paleta de comandos</span>
                <kbd className="px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.1] rounded font-mono text-[10px] text-zinc-300">Ctrl + K</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Búsqueda rápida de SKU en caja</span>
                <kbd className="px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.1] rounded font-mono text-[10px] text-zinc-300">F2</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Cobrar venta actual (Checkout)</span>
                <kbd className="px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.1] rounded font-mono text-[10px] text-zinc-300">F4</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Disparo manual de escáner</span>
                <kbd className="px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.1] rounded font-mono text-[10px] text-zinc-300">Espacio</kbd>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-white/[0.08] bg-card/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Modo Local-First & Resiliencia</h3>
                <p className="text-xs text-zinc-400">Sincronización bidireccional mediante Outbox</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              PulseCommerce opera con IndexedDB local. Las ventas y cobros se guardan en &lt; 20ms localmente e impactan en PostgreSQL en cuanto se restablece la red.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
