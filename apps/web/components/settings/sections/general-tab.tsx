"use client";

import * as React from "react";
import { Edit3, Check, DollarSign } from "lucide-react";
import { SettingsRow } from "../ui/settings-row";
import { SettingsSwitch } from "../ui/settings-switch";
import { SettingsSelect } from "../ui/settings-select";
import { ArgentinaFlag, UsFlag, EuFlag, BrazilFlag } from "../ui/flag-icons";
import { Tooltip } from "@pulsecommerce/ui";

const CURRENCY_OPTIONS = [
  {
    value: "ARS",
    label: "Pesos Argentinos (ARS $)",
    description: "Moneda de curso legal en Argentina",
    icon: ArgentinaFlag,
  },
  {
    value: "USD",
    label: "Dólares Estadounidenses (USD $)",
    description: "Dólar billete / Divisa internacional",
    icon: UsFlag,
  },
  {
    value: "EUR",
    label: "Euros (EUR €)",
    description: "Moneda oficial de la Eurozona",
    icon: EuFlag,
  },
  {
    value: "BRL",
    label: "Reales Brasileños (BRL R$)",
    description: "Moneda de curso legal en Brasil",
    icon: BrazilFlag,
  },
];

export function GeneralTab() {
  const [storeName, setStoreName] = React.useState("Pulse Market Central");
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [cuit, setCuit] = React.useState("30-71829340-4");
  const [isEditingCuit, setIsEditingCuit] = React.useState(false);
  const [currency, setCurrency] = React.useState("ARS");
  const [enableDigitalTickets, setEnableDigitalTickets] = React.useState(true);
  const [autoPrintCopy, setAutoPrintCopy] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white tracking-tight">General</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Identidad comercial, datos fiscales de la sucursal y formato de tickets.
        </p>
      </div>

      <div className="space-y-1">
        {/* Nombre de la Tienda / Razón Social */}
        <SettingsRow
          label="Nombre de la Tienda"
          description="Aparece en el encabezado de los comprobantes y en los reportes de ventas."
        >
          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="h-8 px-2.5 text-xs bg-black/60 border border-emerald-500/50 rounded-lg text-white focus:outline-none"
                autoFocus
              />
              <Tooltip>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                
              </Tooltip>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-2 text-xs font-medium text-zinc-200 hover:text-white group px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <span>{storeName}</span>
              <Edit3 className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200" />
            </button>
          )}
        </SettingsRow>

        {/* CUIT / Identificador Fiscal */}
        <SettingsRow
          label="CUIT / Identificador Fiscal"
          description="Número de identificación tributaria para comprobantes fiscales."
        >
          {isEditingCuit ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                className="h-8 px-2.5 text-xs font-mono bg-black/60 border border-emerald-500/50 rounded-lg text-white focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsEditingCuit(false)}
                className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingCuit(true)}
              className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 group px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <span>{cuit}</span>
              <Edit3 className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200" />
            </button>
          )}
        </SettingsRow>

        {/* Moneda Principal con Dropdown Personalizado */}
        <SettingsRow
          label="Moneda Base"
          description="Moneda principal en la que se calculan los precios y las transacciones de caja."
        >
          <SettingsSelect
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS}
          />
        </SettingsRow>

        {/* Ticket Digital QR */}
        <SettingsRow
          label="Emisión de Ticket Digital (QR)"
          description="Genera un código QR en pantalla al finalizar la venta para que el cliente descargue el ticket en su celular."
        >
          <SettingsSwitch
            checked={enableDigitalTickets}
            onCheckedChange={setEnableDigitalTickets}
            aria-label="Toggle ticket digital"
          />
        </SettingsRow>

        {/* Doble Comprobante */}
        <SettingsRow
          label="Imprimir Duplicado de Ticket"
          description="Emite automáticamente una copia de respaldo para el archivo contable de la tienda."
        >
          <SettingsSwitch
            checked={autoPrintCopy}
            onCheckedChange={setAutoPrintCopy}
            aria-label="Toggle duplicado de ticket"
          />
        </SettingsRow>
      </div>
    </div>
  );
}
