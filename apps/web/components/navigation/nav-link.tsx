"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@pulsecommerce/ui";

export interface NavLinkProps {
  /** Identificador único del enlace de navegación */
  id: string;
  /** Etiqueta visible del enlace */
  label: string;
  /** Ícono de Lucide React */
  icon: LucideIcon;
  /** Indica si la pestaña o ruta se encuentra activa actualmente */
  isActive: boolean;
  /** Callback ejecutado al hacer click o presionar Enter / Space */
  onClick: () => void;
  /** Badge o indicador complementario (ej: 'New', contador numérico, etc.) */
  badge?: React.ReactNode;
  /** Atajo de teclado rápido para el terminal (ej: 'F2', 'F4') */
  shortcut?: string;
  /** Estado deshabilitado */
  disabled?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * `<NavLink />` Componente atómico de navegación para el Sidebar del POS.
 * Diseñado con alto contraste, foco accesible y soporte para atajos de teclado.
 */
export function NavLink({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
  badge,
  shortcut,
  disabled = false,
  className,
}: NavLinkProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-black",
        isActive
          ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-sm font-semibold"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105",
            isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
          )}
        />
        <span className="truncate tracking-tight">{label}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {shortcut && (
          <kbd className="hidden group-hover:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/[0.06] rounded">
            {shortcut}
          </kbd>
        )}
        {badge}
      </div>
    </button>
  );
}
