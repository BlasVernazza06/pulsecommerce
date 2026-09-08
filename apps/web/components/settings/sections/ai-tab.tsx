"use client";

import * as React from "react";
import { Sparkles, Mic, ShieldAlert, Cpu } from "lucide-react";
import { SettingsRow } from "../ui/settings-row";
import { SettingsSwitch } from "../ui/settings-switch";
import { Badge } from "@pulsecommerce/ui";

export function AiTab() {
  const [voicePosEnabled, setVoicePosEnabled] = React.useState(true);
  const [continuousListening, setContinuousListening] = React.useState(false);
  const [requireOcrValidation, setRequireOcrValidation] = React.useState(true);
  const [predictiveReordering, setPredictiveReordering] = React.useState(true);
  const [hitlThreshold, setHitlThreshold] = React.useState("50000");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white tracking-tight">IA & Voice POS</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Orquestación de agentes inteligentes, comandos de voz y políticas de control humano (HITL).
        </p>
      </div>

      <div className="space-y-1">
        {/* Voice POS */}
        <SettingsRow
          label="Voice POS & Comandos de Voz"
          description="Habilita el reconocimiento por voz para agregar productos y cobrar mediante lenguaje natural."
          badge={
            <Badge variant="success" className="text-[10px] py-0 px-1.5 h-4">
              Whisper Edge
            </Badge>
          }
        >
          <SettingsSwitch
            checked={voicePosEnabled}
            onCheckedChange={setVoicePosEnabled}
            aria-label="Toggle voice pos"
          />
        </SettingsRow>

        {/* Escucha Continua */}
        <SettingsRow
          label="Modo de Escucha en Segundo Plano"
          description="Mantiene el buffer de audio activo sin requerir presionar la barra espaciadora."
        >
          <SettingsSwitch
            checked={continuousListening}
            onCheckedChange={setContinuousListening}
            disabled={!voicePosEnabled}
            aria-label="Toggle escucha continua"
          />
        </SettingsRow>

        {/* HITL Threshold */}
        <SettingsRow
          label="Límite Human-in-the-Loop para Mutaciones ($)"
          description="Toda acción sugerida por la IA que supere este importe exigirá aprobación manual obligatoria."
          badge={
            <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
              HITL Policy
            </Badge>
          }
        >
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/[0.1] rounded-lg px-2.5 py-2">
            <span className="text-xs text-zinc-400 font-mono">$</span>
            <input
              type="number"
              step="1000"
              value={hitlThreshold}
              onChange={(e) => setHitlThreshold(e.target.value)}
              className="w-20 bg-transparent text-xs text-right font-mono text-white focus:outline-none"
            />
          </div>
        </SettingsRow>

        {/* Validación OCR de Facturas */}
        <SettingsRow
          label="Validación Previa de Remitos OCR"
          description="Exige revisión interactiva del encargado antes de actualizar precios de compra o registrar stock."
        >
          <SettingsSwitch
            checked={requireOcrValidation}
            onCheckedChange={setRequireOcrValidation}
            aria-label="Toggle validacion ocr"
          />
        </SettingsRow>

        {/* Sugerencias Predictivas */}
        <SettingsRow
          label="Sugerencia Predictiva de Reposición"
          description="La IA analiza la velocidad de rotación de SKUs y genera borradores de órdenes de compra automáticas."
        >
          <SettingsSwitch
            checked={predictiveReordering}
            onCheckedChange={setPredictiveReordering}
            aria-label="Toggle sugerencia predictiva"
          />
        </SettingsRow>
      </div>
    </div>
  );
}
