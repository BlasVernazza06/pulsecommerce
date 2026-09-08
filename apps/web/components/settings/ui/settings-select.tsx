"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SettingsSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: Array<SelectOption<T>>;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  minWidth?: string;
  placement?: "auto" | "top" | "bottom";
  className?: string;
}

/**
 * Dropdown flotante con detección de colisión y apertura inteligente (auto-flip).
 * Si no hay suficiente espacio inferior, se despliega hacia arriba para no ser cortado por footers o modales.
 */
export function SettingsSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  disabled = false,
  size = "md",
  minWidth,
  placement = "auto",
  className = "",
}: SettingsSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openUpwards, setOpenUpwards] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Opción actualmente seleccionada
  const selectedOption = options.find((opt) => opt.value === value);

  // Detección de espacio para auto-flip (hacia arriba si queda poco espacio abajo)
  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      if (placement === "top") {
        setOpenUpwards(true);
      } else if (placement === "bottom") {
        setOpenUpwards(false);
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        // Estimar altura del menú (~48px por opción + padding)
        const estimatedHeight = Math.min(options.length * 48 + 20, 260);
        const spaceBelow = window.innerHeight - rect.bottom;
        
        // Si el espacio inferior es menor a la altura estimada + 80px de margen, abrir hacia arriba
        setOpenUpwards(spaceBelow < estimatedHeight + 80);
      }
    }
  }, [isOpen, placement, options.length]);

  // Cerrar al hacer clic fuera del componente
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Cerrar con Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  const isSmall = size === "sm";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={minWidth ? { minWidth } : undefined}
    >
      {/* ─── TRIGGER DEL SELECT (Matte Dark) ─── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-3 rounded-xl border bg-[#111114] text-white transition-all cursor-pointer select-none hover:bg-[#18181c] ${
          isOpen
            ? "border-zinc-600 bg-[#18181c]"
            : "border-zinc-800 hover:border-zinc-700"
        } ${
          isSmall
            ? "h-8 min-w-[140px] px-3 text-xs"
            : "h-9 min-w-[260px] sm:min-w-[280px] px-3.5 text-xs font-medium"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          {selectedOption?.icon && (
            <selectedOption.icon className="shrink-0" />
          )}
          <span className="truncate text-zinc-200 font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-zinc-200" : ""
          }`}
        />
      </button>

      {/* ─── MENÚ POPOVER FLOTANTE (Auto-Flip Top / Bottom) ─── */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute right-0 w-full min-w-[280px] sm:min-w-[320px] p-1.5 bg-[#101013] border border-zinc-800 rounded-xl shadow-2xl z-50 space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-100 overflow-hidden ${
            openUpwards
              ? "bottom-full mb-1.5 origin-bottom"
              : "top-full mt-1.5 origin-top"
          }`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer group ${
                  isSelected
                    ? "bg-zinc-800/90 text-white font-semibold"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  {Icon && (
                    <Icon className="shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-[13px] leading-snug">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-[11px] text-zinc-400 font-normal leading-normal mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-emerald-400 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
