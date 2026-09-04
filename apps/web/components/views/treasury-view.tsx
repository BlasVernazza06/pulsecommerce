"use client";

import * as React from "react";
import { Card, Badge, Button } from "@pulsecommerce/ui";
import { Wallet, ArrowDownRight, ArrowUpRight, Lock, CheckCircle2 } from "lucide-react";

export function TreasuryView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b border-white/[0.06] px-6 flex items-center justify-between bg-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Arqueo de Caja & Control de Tesorería
          </h2>
          <Badge variant="success" dot className="text-[10px]">
            Turno Abierto #418
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-8 text-xs border-white/[0.08] bg-white/[0.02]">
            <Lock className="h-3.5 w-3.5" />
            <span>Cierre Ciego de Turno</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-white/[0.08] bg-card/50">
            <span className="text-xs text-zinc-400 font-medium">Efectivo en Gaveta</span>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white font-mono">$ 84,500.00</span>
              <p className="text-[11px] text-zinc-500 mt-1">Fondo inicial + ingresos en efectivo</p>
            </div>
          </Card>

          <Card className="p-5 border-white/[0.08] bg-card/50">
            <span className="text-xs text-zinc-400 font-medium">Cobros Electrónicos (Tarjetas / QR)</span>
            <div className="mt-2">
              <span className="text-2xl font-bold text-emerald-400 font-mono">$ 231,200.00</span>
              <p className="text-[11px] text-zinc-500 mt-1">Acreditado en cuenta recaudadora</p>
            </div>
          </Card>

          <Card className="p-5 border-white/[0.08] bg-card/50">
            <span className="text-xs text-zinc-400 font-medium">Retiros Parciales de Caja</span>
            <div className="mt-2">
              <span className="text-2xl font-bold text-amber-400 font-mono">$ 40,000.00</span>
              <p className="text-[11px] text-zinc-500 mt-1">2 extracciones a caja fuerte</p>
            </div>
          </Card>
        </div>

        <Card className="border-white/[0.08] bg-card/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Movimientos de Tesorería del Turno</h3>
              <p className="text-xs text-zinc-400">Auditoría inmutable de ingresos, egresos y retiros</p>
            </div>
            <Badge variant="neutral" className="text-[10px]">Turno en Curso</Badge>
          </div>

          <div className="space-y-2">
            {[
              { time: "18:42", type: "Venta Efectivo", amount: "+$ 4,500", icon: ArrowDownRight, color: "text-emerald-400" },
              { time: "17:15", type: "Retiro Parcial (Caja Fuerte)", amount: "-$ 20,000", icon: ArrowUpRight, color: "text-amber-400" },
              { time: "15:30", type: "Venta QR Interoperable", amount: "+$ 12,800", icon: ArrowDownRight, color: "text-emerald-400" },
              { time: "09:00", type: "Apertura de Caja (Fondo Inicial)", amount: "+$ 20,000", icon: CheckCircle2, color: "text-blue-400" },
            ].map((mov, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <mov.icon className={`h-4 w-4 ${mov.color}`} />
                  <div>
                    <span className="text-xs font-medium text-zinc-200">{mov.type}</span>
                    <span className="text-[11px] text-zinc-500 ml-2 font-mono">{mov.time}</span>
                  </div>
                </div>
                <span className={`text-xs font-mono font-semibold ${mov.color}`}>{mov.amount}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
