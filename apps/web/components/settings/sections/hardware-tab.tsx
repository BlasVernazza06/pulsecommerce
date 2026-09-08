"use client";

import * as React from "react";
import { Printer, Usb, Check, RefreshCw } from "lucide-react";
import { SettingsRow } from "../ui/settings-row";
import { SettingsSwitch } from "../ui/settings-switch";
import { SettingsSelect } from "../ui/settings-select";
import { Badge, Button } from "@pulsecommerce/ui";

const PAPER_WIDTH_OPTIONS: Array<{ value: "80mm" | "58mm"; label: string; description: string }> = [
  { value: "80mm", label: "80 mm (Estándar)", description: "48 columnas de texto para ticket fiscal" },
  { value: "58mm", label: "58 mm (Compacto)", description: "32 columnas para miniprinters portátiles" },
];

export function HardwareTab() {
  const [paperWidth, setPaperWidth] = React.useState<"80mm" | "58mm">("80mm");
  const [autoCutPaper, setAutoCutPaper] = React.useState(true);
  const [openDrawerOnCash, setOpenDrawerOnCash] = React.useState(true);
  const [laserBufferTrap, setLaserBufferTrap] = React.useState(true);
  const [autoEnterSuffix, setAutoEnterSuffix] = React.useState(true);
  const [isTestingPrint, setIsTestingPrint] = React.useState(false);

  const handleTestPrint = () => {
    setIsTestingPrint(true);
    setTimeout(() => {
      setIsTestingPrint(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white tracking-tight">Hardware & POS</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Integración física directa con periféricos de punto de venta (ESC/POS & HID Scanner).
        </p>
      </div>

      <div className="space-y-1">
        {/* Impresora Térmica */}
        <SettingsRow
          label="Impresora Térmica ESC/POS"
          description="Epson TM-T20III (Conectada vía WebUSB en /dev/usb/lp0)."
          badge={
            <Badge variant="success" className="text-[10px] py-0 px-1.5 h-4">
              Conectada
            </Badge>
          }
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestPrint}
            disabled={isTestingPrint}
            className="h-8 text-xs border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer"
          >
            {isTestingPrint ? (
              <span className="flex items-center gap-1.5 text-zinc-300">
                <RefreshCw className="h-3 w-3 animate-spin" /> Imprimiendo...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Printer className="h-3.5 w-3.5" /> Test Print
              </span>
            )}
          </Button>
        </SettingsRow>

        {/* Ancho de Rollo con Custom Select */}
        <SettingsRow
          label="Ancho del Rollo de Papel"
          description="Formato de columnas para el renderizado del ticket fiscal o comanda."
        >
          <SettingsSelect
            value={paperWidth}
            onChange={setPaperWidth}
            options={PAPER_WIDTH_OPTIONS}
          />
        </SettingsRow>

        {/* Corte Automático */}
        <SettingsRow
          label="Auto-Corte de Papel (Cutter)"
          description="Envía el comando ESC/POS 'GS V 66' al finalizar cada comprobante."
        >
          <SettingsSwitch
            checked={autoCutPaper}
            onCheckedChange={setAutoCutPaper}
            aria-label="Toggle auto-corte"
          />
        </SettingsRow>

        {/* Apertura de Gaveta de Dinero */}
        <SettingsRow
          label="Apertura de Gaveta en Cobro Efectivo"
          description="Envía un pulso de 24V al puerto RJ11 de la gaveta cuando se finaliza un pago en efectivo."
        >
          <SettingsSwitch
            checked={openDrawerOnCash}
            onCheckedChange={setOpenDrawerOnCash}
            aria-label="Toggle apertura de gaveta"
          />
        </SettingsRow>

        {/* Lector Láser HID Trap */}
        <SettingsRow
          label="Interrupción Rápida de Buffer HID (<50ms)"
          description="Distingue pulsaciones de pistola láser respecto al tipeo manual para auto-agregar SKUs al carrito."
          badge={
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
              Activo
            </Badge>
          }
        >
          <SettingsSwitch
            checked={laserBufferTrap}
            onCheckedChange={setLaserBufferTrap}
            aria-label="Toggle trampa de buffer HID"
          />
        </SettingsRow>

        {/* Sufijo Enter */}
        <SettingsRow
          label="Auto-Confirmación por Sufijo Enter"
          description="Inserta y calcula el producto inmediatamente cuando el escáner emite retorno de carro."
        >
          <SettingsSwitch
            checked={autoEnterSuffix}
            onCheckedChange={setAutoEnterSuffix}
            aria-label="Toggle sufijo enter"
          />
        </SettingsRow>
      </div>
    </div>
  );
}
