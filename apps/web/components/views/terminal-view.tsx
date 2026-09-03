"use client";

import * as React from "react";
import {
  Button,
  Card,
  Badge,
  ChartContainer,
  type ChartThemeName,
} from "@pulsecommerce/ui";
import {
  Plus,
  Zap,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";

export function TerminalView() {
  const [chartTheme, setChartTheme] = React.useState<ChartThemeName>("default");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header dentro de la Isla */}
      <header className="h-16 border-b border-white/[0.06] px-6 flex items-center justify-between bg-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Terminal Operativo & Ventas
          </h2>
          <Badge variant="outline" className="text-[10px] text-zinc-400 font-mono">
            v1.0.4
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Selector for Chart Customization */}
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400 ml-1.5" />
            <span className="text-[11px] text-zinc-400 px-1.5 font-medium">
              Color:
            </span>
            {(["default", "emerald", "cyberpunk", "sunset"] as ChartThemeName[]).map(
              (theme) => (
                <button
                  key={theme}
                  onClick={() => setChartTheme(theme)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    chartTheme === theme
                      ? "bg-white/10 text-white shadow-sm border border-white/10"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                  }`}
                >
                  {theme}
                </button>
              )
            )}
          </div>

          {/* Primary Action Button (High Contrast White) */}
          <Button className="gap-2 shadow-glow h-8 text-xs font-semibold px-3">
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Venta (F4)</span>
          </Button>
        </div>
      </header>

      {/* Contenido scrolleable dentro de la Isla */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Main Card (Style Kangaroo / Dub.co) */}
        <Card className="border-white/[0.08] bg-card/60 relative overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-white/[0.06]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    terminal.pos/caja-central-01
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    ID: #POS-7749
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Modo Local-First Activo &bull; Outbox Sincronizado &bull; Latencia &lt; 20ms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" dot pulse className="text-xs py-1 px-3">
                <span className="text-zinc-200 font-medium">1,429 transacciones</span>
                <TrendingUp className="h-3 w-3 text-emerald-400 ml-1" />
              </Badge>
            </div>
          </div>

          {/* Dynamic Chart Container */}
          <div className="p-6">
            <ChartContainer theme={chartTheme} className="h-64 flex flex-col justify-end">
              <div className="flex items-end justify-between gap-3 h-48 pt-6">
                {[
                  { day: "Lun", val: 45, items: "120 vtas" },
                  { day: "Mar", val: 68, items: "185 vtas" },
                  { day: "Mie", val: 52, items: "142 vtas" },
                  { day: "Jue", val: 89, items: "240 vtas" },
                  { day: "Vie", val: 94, items: "310 vtas" },
                  { day: "Sab", val: 100, items: "420 vtas" },
                  { day: "Dom", val: 78, items: "210 vtas" },
                ].map((bar, i) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {bar.items}
                    </div>
                    <div
                      style={{
                        height: `${bar.val}%`,
                        backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))`,
                      }}
                      className="w-full rounded-t-lg transition-all duration-500 hover:brightness-125 opacity-90 shadow-sm"
                    />
                    <span className="text-xs text-zinc-400 font-medium">{bar.day}</span>
                  </div>
                ))}
              </div>
            </ChartContainer>
          </div>
        </Card>

        {/* Sub-grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-white/[0.08] bg-card/50 min-h-[220px] flex flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Stock & Puntos de Reorden
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Cálculo de reposición sugerida en base a velocidad de rotación.
                </p>
              </div>
              <Badge variant="warning" className="text-[10px]">
                3 Alertas
              </Badge>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs text-zinc-200">Coca-Cola 500ml Zero</span>
                <span className="text-xs font-mono text-amber-400">4 unidades restantes</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs text-zinc-200">Galletitas Oreo 117g</span>
                <span className="text-xs font-mono text-amber-400">2 unidades restantes</span>
              </div>
            </div>
          </Card>

          <Card className="border-white/[0.08] bg-card/50 min-h-[220px] flex flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Ingesta Multimodal (OCR Facturas)
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Arrastra o escanea un remito físico para conciliar catálogo y costos.
                </p>
              </div>
              <Badge variant="info" className="text-[10px]">
                Zod Validated
              </Badge>
            </div>

            <div className="mt-4 border border-dashed border-white/[0.12] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 hover:border-white/30 transition-colors cursor-pointer bg-white/[0.01]">
              <p className="text-xs font-medium text-zinc-300">
                Arrastra tu factura o remito aquí
              </p>
              <p className="text-[10px] text-zinc-500">
                Soporta PDF, PNG, JPG &bull; Extracción automática por IA
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
