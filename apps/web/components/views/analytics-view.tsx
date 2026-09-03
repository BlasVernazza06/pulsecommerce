"use client";

import * as React from "react";
import { Card, Badge, Button } from "@pulsecommerce/ui";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, ArrowUpRight, Calendar } from "lucide-react";

export function AnalyticsView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b border-white/[0.06] px-6 flex items-center justify-between bg-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Analítica de Negocio & Rendimiento
          </h2>
          <Badge variant="outline" className="text-[10px] text-zinc-400">
            En Tiempo Real
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-white/[0.08] bg-white/[0.02]">
            <Calendar className="h-3.5 w-3.5" />
            <span>Últimos 30 días</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-white/[0.08] bg-card/50">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Facturación Bruta</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">$ 3,842,500</span>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+14.2% vs mes anterior</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-white/[0.08] bg-card/50">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Tickets Emitidos</span>
              <ShoppingCart className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">1,429</span>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+8.1% vs mes anterior</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-white/[0.08] bg-card/50">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Ticket Promedio</span>
              <BarChart3 className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">$ 2,688.94</span>
              <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                <span>Promedio por transacción</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-white/[0.08] bg-card/50">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Margen Promedio</span>
              <ArrowUpRight className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">38.4%</span>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
                <span>Margen sobre costo reposición</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Breakdown Card */}
        <Card className="p-6 border-white/[0.08] bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Ventas por Categoría de Producto</h3>
              <p className="text-xs text-zinc-400">Rendimiento y volumen de ventas distribuido</p>
            </div>
            <Badge variant="neutral" className="text-xs font-mono">Drizzle Aggregated</Badge>
          </div>

          <div className="space-y-3">
            {[
              { name: "Bebidas y Gaseosas", pct: 42, amount: "$ 1,613,850", color: "bg-blue-500" },
              { name: "Snacks y Golosinas", pct: 28, amount: "$ 1,075,900", color: "bg-emerald-500" },
              { name: "Almacén y Comestibles", pct: 18, amount: "$ 691,650", color: "bg-amber-500" },
              { name: "Cigarrillos y Tabaco", pct: 12, amount: "$ 461,100", color: "bg-purple-500" },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-200 font-medium">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 font-mono">{cat.amount}</span>
                    <span className="font-semibold text-white w-8 text-right">{cat.pct}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
