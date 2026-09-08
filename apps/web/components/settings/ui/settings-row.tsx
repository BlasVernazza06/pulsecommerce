"use client";

import * as React from "react";

export interface SettingsRowProps {
  label: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Fila estandarizada para el panel de ajustes:
 * - Izquierda: Título de la configuración, subtítulo explicativo y badges.
 * - Derecha: Control interactivo (Switch, Input, Select, Botón de acción).
 */
export function SettingsRow({
  label,
  description,
  badge,
  children,
}: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/[0.06] last:border-0 gap-6">
      <div className="space-y-0.5 max-w-[52%] min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white tracking-tight">{label}</span>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    </div>
  );
}
