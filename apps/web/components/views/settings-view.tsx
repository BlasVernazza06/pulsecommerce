"use client";

import * as React from "react";
import { Card, Badge, Button } from "@pulsecommerce/ui";
import { Settings, Printer, Usb, Cpu, Radio, ShieldCheck } from "lucide-react";

export function SettingsView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b border-white/[0.06] px-6 flex items-center justify-between bg-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Ajustes del Sistema & Periféricos POS
          </h2>
          <Badge variant="outline" className="text-[10px] text-zinc-400">
            Hardware Stack Tier-1
          </Badge>
        </div>

        <Button size="sm" className="h-8 text-xs font-semibold px-3 shadow-glow">
          Guardar Cambios
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-white/[0.08] bg-card/50 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Printer className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Impresora Térmica ESC/POS</h3>
                  <p className="text-xs text-zinc-400">Protocolo directo WebUSB / Daemon Local</p>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">Conectada</Badge>
            </div>
            <p className="text-xs text-zinc-400">
              Impresión instantánea en menos de 100ms de tickets fiscales y comandas.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
              <span className="text-zinc-400">Modelo: Epson TM-T20III (USB)</span>
              <Button variant="outline" size="sm" className="h-7 text-xs border-white/[0.08]">Test Print</Button>
            </div>
          </Card>

          <Card className="p-6 border-white/[0.08] bg-card/50 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Usb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Lector de Códigos (HID)</h3>
                  <p className="text-xs text-zinc-400">Interrupción de buffer de teclado en &lt; 50ms</p>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">Buffer Activo</Badge>
            </div>
            <p className="text-xs text-zinc-400">
              Escáner dual láser y fallback WebAssembly BarcodeDetector API.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
              <span className="text-zinc-400">Modo: Global Keyboard Trap (F2 auto)</span>
              <Button variant="outline" size="sm" className="h-7 text-xs border-white/[0.08]">Calibrar</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
