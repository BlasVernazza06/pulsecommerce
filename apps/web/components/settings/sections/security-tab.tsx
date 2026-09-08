"use client";

import * as React from "react";
import { ShieldCheck, Lock, EyeOff, AlertTriangle } from "lucide-react";
import { SettingsRow } from "../ui/settings-row";
import { SettingsSwitch } from "../ui/settings-switch";
import { SettingsSelect } from "../ui/settings-select";
import { Badge } from "@pulsecommerce/ui";

const AUTO_LOCK_OPTIONS = [
  { value: "2", label: "2 Minutos de inactividad", description: "Recomendado para cajas de alta concurrencia" },
  { value: "5", label: "5 Minutos de inactividad", description: "Tiempo estándar para terminales principales" },
  { value: "15", label: "15 Minutos de inactividad", description: "Terminales de oficina o supervisión" },
  { value: "0", label: "Desactivado", description: "No recomendado para cajas físicas" },
];

export function SecurityTab() {
  const [blindClose, setBlindClose] = React.useState(true);
  const [cashDropAlert, setCashDropAlert] = React.useState(true);
  const [cashDropThreshold, setCashDropThreshold] = React.useState("250000");
  const [autoLockMinutes, setAutoLockMinutes] = React.useState("5");
  const [supervisorPinForVoid, setSupervisorPinForVoid] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white tracking-tight">Caja & Seguridad</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Políticas de control de tesorería, arqueo ciego, auto-bloqueo y prevención de pérdidas.
        </p>
      </div>

      <div className="space-y-1">
        {/* Arqueo Ciego */}
        <SettingsRow
          label="Arqueo de Caja Ciego (Blind Close)"
          description="Oculta el total teórico al cajero durante el cierre de turno. Obliga a contar el dinero físico sin sesgo."
          badge={
            <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
              Recomendado
            </Badge>
          }
        >
          <SettingsSwitch
            checked={blindClose}
            onCheckedChange={setBlindClose}
            aria-label="Toggle arqueo ciego"
          />
        </SettingsRow>

        {/* Alerta de Retiro de Caja */}
        <SettingsRow
          label="Alerta de Retiro de Seguridad (Cash Drop)"
          description="Dispara un aviso en pantalla cuando el efectivo físico acumulado en el cajón supera el límite."
        >
          <div className="flex items-center gap-2.5">
            {cashDropAlert && (
              <div className="flex items-center gap-1 bg-black/60 border border-white/[0.1] rounded-lg px-2 py-0.5">
                <span className="text-[11px] text-zinc-400 font-mono">$</span>
                <input
                  type="number"
                  step="10000"
                  value={cashDropThreshold}
                  onChange={(e) => setCashDropThreshold(e.target.value)}
                  className="w-20 bg-transparent text-xs text-right font-mono text-white focus:outline-none"
                />
              </div>
            )}
            <SettingsSwitch
              checked={cashDropAlert}
              onCheckedChange={setCashDropAlert}
              aria-label="Toggle alerta de retiro"
            />
          </div>
        </SettingsRow>

        {/* PIN para Anulaciones */}
        <SettingsRow
          label="PIN de Supervisor para Anulaciones"
          description="Exige autorización del Manager u Owner para cancelar un ticket cobrado o borrar un ítem del carrito."
        >
          <SettingsSwitch
            checked={supervisorPinForVoid}
            onCheckedChange={setSupervisorPinForVoid}
            aria-label="Toggle pin de supervisor"
          />
        </SettingsRow>

        {/* Auto-Bloqueo de Pantalla con Custom Select */}
        <SettingsRow
          label="Bloqueo Automático por Inactividad"
          description="Bloquea el acceso al POS y solicita PIN de empleado tras el tiempo estipulado."
        >
          <SettingsSelect
            value={autoLockMinutes}
            onChange={setAutoLockMinutes}
            options={AUTO_LOCK_OPTIONS}
          />
        </SettingsRow>
      </div>
    </div>
  );
}
