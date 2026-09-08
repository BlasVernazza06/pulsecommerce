"use client";

import * as React from "react";

export interface SettingsSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

/**
 * Switch minimalista de alta precisión inspirado en interfaces modernas (iOS / Raycast / macOS)
 * Diseñado con transiciones suaves y estados de foco accesibles.
 */
export function SettingsSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}: SettingsSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
        disabled
          ? "opacity-40 cursor-not-allowed bg-zinc-800"
          : checked
          ? "bg-zinc-200 dark:bg-zinc-100"
          : "bg-zinc-700/60 hover:bg-zinc-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md transition-transform duration-200 ease-in-out ${
          checked
            ? "translate-x-5 bg-zinc-950"
            : "translate-x-0 bg-zinc-400"
        }`}
      />
    </button>
  );
}
