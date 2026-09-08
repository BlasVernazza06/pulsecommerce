"use client";

import * as React from "react";
import { RefreshCw, Database, WifiOff, CheckCircle2 } from "lucide-react";
import { SettingsRow } from "../ui/settings-row";
import { SettingsSwitch } from "../ui/settings-switch";
import { SettingsSelect } from "../ui/settings-select";
import { Badge, Button } from "@pulsecommerce/ui";

const OUTBOX_INTERVAL_OPTIONS = [
  { value: "2", label: "Cada 2 Segundos", description: "Drenado ultrarrápido para cajas intensivas" },
  { value: "5", label: "Cada 5 Segundos (Estándar)", description: "Balance óptimo entre latencia y red" },
  { value: "15", label: "Cada 15 Segundos", description: "Bajo consumo de red y recursos" },
  { value: "60", label: "Cada 1 Minuto", description: "Para conexiones móviles limitadas" },
];

export function SyncTab() {
  const [forcedOffline, setForcedOffline] = React.useState(false);
  const [outboxInterval, setOutboxInterval] = React.useState("5");
  const [isSyncingNow, setIsSyncingNow] = React.useState(false);
  const [syncedSuccess, setSyncedSuccess] = React.useState(false);

  const handleForceSync = () => {
    setIsSyncingNow(true);
    setSyncedSuccess(false);
    setTimeout(() => {
      setIsSyncingNow(false);
      setSyncedSuccess(true);
      setTimeout(() => setSyncedSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white tracking-tight">Offline & Sincronización</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Motor Local-First en Dexie.js (IndexedDB), drenado de cola Outbox y persistencia offline.
        </p>
      </div>

      <div className="space-y-1">
        {/* Forzar Sync Completo */}
        <SettingsRow
          label="Sincronización Bidireccional de Catálogo"
          description="Descarga el snapshot más reciente desde PostgreSQL y drena la cola de transacciones locales."
          badge={
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
              0 Pendientes
            </Badge>
          }
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleForceSync}
            disabled={isSyncingNow}
            className="h-8 text-xs border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer"
          >
            {isSyncingNow ? (
              <span className="flex items-center gap-1.5 text-zinc-300">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" /> Sincronizando...
              </span>
            ) : syncedSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> ¡Al día!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Forzar Sync
              </span>
            )}
          </Button>
        </SettingsRow>

        {/* Frecuencia de Drenado Outbox con Custom Select */}
        <SettingsRow
          label="Frecuencia de Drenado del Outbox"
          description="Intervalo en segundos en el que el worker en segundo plano intenta subir transacciones a la API."
        >
          <SettingsSelect
            value={outboxInterval}
            onChange={setOutboxInterval}
            options={OUTBOX_INTERVAL_OPTIONS}
          />
        </SettingsRow>

        {/* Modo Offline Forzado */}
        <SettingsRow
          label="Modo de Contingencia Offline Forzado"
          description="Simula una caída total de red para validar que el terminal facture y acumule eventos en Dexie.js sin interrupciones."
          badge={
            forcedOffline ? (
              <Badge variant="warning" className="text-[10px] py-0 px-1.5 h-4">
                Simulador Activo
              </Badge>
            ) : undefined
          }
        >
          <SettingsSwitch
            checked={forcedOffline}
            onCheckedChange={setForcedOffline}
            aria-label="Toggle modo contingencia"
          />
        </SettingsRow>
      </div>
    </div>
  );
}
