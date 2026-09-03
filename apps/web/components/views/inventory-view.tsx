"use client";

import * as React from "react";
import { Card, Badge, Button } from "@pulsecommerce/ui";
import { ShoppingBag, Plus, AlertTriangle, Layers } from "lucide-react";
import { MOCK_PRODUCTS, type Product } from "@pulsecommerce/contracts";

export function InventoryView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b border-white/[0.06] px-6 flex items-center justify-between bg-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Inventario & Stock Multidepósito
          </h2>
          <Badge variant="outline" className="text-[10px] text-zinc-400">
            {MOCK_PRODUCTS.length} Productos
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 shadow-glow h-8 text-xs font-semibold px-3">
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar Producto</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-white/[0.08] bg-card/50">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Depósito Central (Almacén 01)</span>
              <Layers className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white">4,812 un.</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">En stock disponible</p>
            </div>
          </Card>

          <Card className="p-4 border-white/[0.08] bg-card/50">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Sucursal 1 (Caja & Góndola)</span>
              <ShoppingBag className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white">1,240 un.</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">Puntos de venta activos</p>
            </div>
          </Card>

          <Card className="p-4 border-white/[0.08] bg-card/50">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Alertas de Reposición</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-amber-400">3 SKUs</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">Por debajo del punto de reorden</p>
            </div>
          </Card>
        </div>

        {/* Tabla de Productos */}
        <Card className="border-white/[0.08] bg-card/50 overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Catálogo de Productos & Precios</span>
            <Badge variant="neutral" className="text-[10px]">Trazabilidad en tiempo real</Badge>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {MOCK_PRODUCTS.map((product: Product) => (
              <div key={product.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">{product.name}</span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    SKU: {product.sku} &bull; Barcode: {product.primaryBarcode}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-white font-mono">
                      ${Number(product.price).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Costo: ${Number(product.costPrice).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={product.stock <= product.minStockAlert ? "warning" : "success"}
                    className="text-[10px]"
                  >
                    {product.stock} {product.unit}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
