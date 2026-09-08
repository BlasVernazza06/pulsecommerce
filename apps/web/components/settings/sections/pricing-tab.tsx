"use client";

import * as React from "react";
import { DollarSign, Percent, ShieldAlert } from "lucide-react";
import { SettingsRow } from "../ui/settings-row";
import { SettingsSwitch } from "../ui/settings-switch";
import { SettingsSelect } from "../ui/settings-select";
import { Badge } from "@pulsecommerce/ui";

const VAT_OPTIONS = [
  { value: "0.21", label: "21.0% (Tasa General)", description: "Alícuota estándar para consumo minorista" },
  { value: "0.105", label: "10.5% (Tasa Reducida)", description: "Bienes de capital, carnes, frutas y verduras" },
  { value: "0.27", label: "27.0% (Servicios / Especial)", description: "Telecomunicaciones y servicios públicos" },
  { value: "0.0", label: "0.0% (Exento)", description: "Libros, medicamentos y productos exentos" },
];

const ROUNDING_OPTIONS = [
  { value: "10", label: "Múltiplos de $10" },
  { value: "50", label: "Múltiplos de $50" },
  { value: "100", label: "Múltiplos de $100" },
];

export function PricingTab() {
  const [defaultVatRate, setDefaultVatRate] = React.useState("0.21");
  const [cashRounding, setCashRounding] = React.useState(true);
  const [roundingStep, setRoundingStep] = React.useState("50");
  const [cashDiscount, setCashDiscount] = React.useState("10");
  const [creditCardSurcharge, setCreditCardSurcharge] = React.useState("5");
  const [marginProtection, setMarginProtection] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white tracking-tight">Precios & Fiscal</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Reglas de cálculo impositivo, recargos por medio de pago y protección de márgenes.
        </p>
      </div>

      <div className="space-y-1">
        {/* IVA por Defecto con Custom Select */}
        <SettingsRow
          label="Alícuota de IVA por Defecto"
          description="Alícuota aplicada automáticamente a nuevos productos y en la discriminación fiscal del carrito."
        >
          <SettingsSelect
            value={defaultVatRate}
            onChange={setDefaultVatRate}
            options={VAT_OPTIONS}
          />
        </SettingsRow>

        {/* Redondeo de Efectivo con Custom Select */}
        <SettingsRow
          label="Redondeo Automático de Efectivo"
          description="Ajusta el total a múltiplos exactos para simplificar la entrega de cambio físico."
        >
          <div className="flex items-center gap-2.5">
            {cashRounding && (
              <SettingsSelect
                value={roundingStep}
                onChange={setRoundingStep}
                options={ROUNDING_OPTIONS}
                size="sm"
              />
            )}
            <SettingsSwitch
              checked={cashRounding}
              onCheckedChange={setCashRounding}
              aria-label="Toggle redondeo de efectivo"
            />
          </div>
        </SettingsRow>

        {/* Descuento por Efectivo */}
        <SettingsRow
          label="Descuento Global por Pago en Efectivo"
          description="Bonificación automática aplicada al seleccionar 'Efectivo' en la pantalla de cobro (F4)."
        >
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/[0.1] rounded-lg px-2 py-2">
            <span className="text-xs text-zinc-400 font-mono">%</span>
            <input
              type="number"
              min="0"
              max="50"
              value={cashDiscount}
              onChange={(e) => setCashDiscount(e.target.value)}
              className="w-12 bg-transparent text-xs text-right font-mono text-white focus:outline-none"
            />
          </div>
        </SettingsRow>

        {/* Recargo por Tarjeta */}
        <SettingsRow
          label="Recargo por Tarjeta de Crédito (1 Cuota)"
          description="Compensa comisiones de procesamiento de adquirentes (Posnet/Clover)."
        >
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/[0.1] rounded-lg px-2 py-2">
            <span className="text-xs text-zinc-400 font-mono">%</span>
            <input
              type="number"
              min="0"
              max="50"
              value={creditCardSurcharge}
              onChange={(e) => setCreditCardSurcharge(e.target.value)}
              className="w-12 bg-transparent text-xs text-right font-mono text-white focus:outline-none"
            />
          </div>
        </SettingsRow>

        {/* Protección de Margen */}
        <SettingsRow
          label="Protección de Margen Mínimo de Ganancia"
          description="Bloquea descuentos manuales en caja si el precio final queda por debajo del costo del producto."
          badge={
            <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
              Guardrail
            </Badge>
          }
        >
          <SettingsSwitch
            checked={marginProtection}
            onCheckedChange={setMarginProtection}
            aria-label="Toggle proteccion de margen"
          />
        </SettingsRow>
      </div>
    </div>
  );
}
