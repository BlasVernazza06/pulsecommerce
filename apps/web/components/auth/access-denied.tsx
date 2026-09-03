"use client";

import * as React from "react";
import { ShieldAlert } from "lucide-react";
import { Card, Button } from "@pulsecommerce/ui";

export interface AccessDeniedProps {
  /** Callback para restablecer la navegación a una vista segura */
  onReset?: () => void;
  /** Título del mensaje de restricción */
  title?: string;
  /** Detalle o motivo de la restricción */
  description?: string;
  /** Texto del botón de acción */
  buttonLabel?: string;
}

/**
 * `<AccessDenied />` Componente de contingencia para usuarios sin permisos suficientes.
 */
export function AccessDenied({
  onReset,
  title = "Acceso Restringido",
  description = "Tu rol de empleado no cuenta con los permisos necesarios para acceder a este módulo del sistema.",
  buttonLabel = "Volver a la Terminal de Ventas",
}: AccessDeniedProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 h-full select-none">
      <Card className="max-w-md p-6 border-white/[0.08] bg-card/60 text-center space-y-4 shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-zinc-400 mt-1">{description}</p>
        </div>
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="w-full text-xs border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06]"
          >
            {buttonLabel}
          </Button>
        )}
      </Card>
    </div>
  );
}
