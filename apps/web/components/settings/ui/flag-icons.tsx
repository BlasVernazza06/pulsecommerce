"use client";

import * as React from "react";

/**
 * Bandera de Argentina (Vector SVG con dimensiones estrictas)
 */
export function ArgentinaFlag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 w-5 h-3.5 min-w-[20px] max-w-[20px] h-[14px] rounded-[2px] overflow-hidden border border-white/10 shadow-xs ${className}`}
    >
      <svg viewBox="0 0 768 512" className="w-full h-full block object-cover">
        <rect width="768" height="512" fill="#74acdf" />
        <rect width="768" height="170.66" y="170.66" fill="#ffffff" />
        {/* Sol de Mayo */}
        <circle cx="384" cy="256" r="38" fill="#f6b40e" stroke="#855314" strokeWidth="3" />
        <circle cx="384" cy="256" r="28" fill="#f6b40e" />
      </svg>
    </span>
  );
}

/**
 * Bandera de Estados Unidos (Vector SVG con dimensiones estrictas)
 */
export function UsFlag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 w-5 h-3.5 min-w-[20px] max-w-[20px] h-[14px] rounded-[2px] overflow-hidden border border-white/10 shadow-xs ${className}`}
    >
      <svg viewBox="0 0 768 512" className="w-full h-full block object-cover">
        {/* Franjas rojas y blancas */}
        <rect width="768" height="512" fill="#b22234" />
        <rect width="768" height="39.38" y="39.38" fill="#ffffff" />
        <rect width="768" height="39.38" y="118.15" fill="#ffffff" />
        <rect width="768" height="39.38" y="196.92" fill="#ffffff" />
        <rect width="768" height="39.38" y="275.69" fill="#ffffff" />
        <rect width="768" height="39.38" y="354.46" fill="#ffffff" />
        <rect width="768" height="39.38" y="433.23" fill="#ffffff" />
        {/* Cantón azul */}
        <rect width="307" height="275.69" fill="#3c3b6e" />
        {/* Estrellas minimalistas */}
        <circle cx="60" cy="55" r="8" fill="#ffffff" />
        <circle cx="150" cy="55" r="8" fill="#ffffff" />
        <circle cx="240" cy="55" r="8" fill="#ffffff" />
        <circle cx="105" cy="110" r="8" fill="#ffffff" />
        <circle cx="195" cy="110" r="8" fill="#ffffff" />
        <circle cx="60" cy="165" r="8" fill="#ffffff" />
        <circle cx="150" cy="165" r="8" fill="#ffffff" />
        <circle cx="240" cy="165" r="8" fill="#ffffff" />
        <circle cx="105" cy="220" r="8" fill="#ffffff" />
        <circle cx="195" cy="220" r="8" fill="#ffffff" />
      </svg>
    </span>
  );
}

/**
 * Bandera de la Unión Europea (Vector SVG con dimensiones estrictas)
 */
export function EuFlag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 w-5 h-3.5 min-w-[20px] max-w-[20px] h-[14px] rounded-[2px] overflow-hidden border border-white/10 shadow-xs ${className}`}
    >
      <svg viewBox="0 0 768 512" className="w-full h-full block object-cover">
        <rect width="768" height="512" fill="#003399" />
        {/* Círculo de estrellas amarillas */}
        <circle cx="384" cy="150" r="14" fill="#ffcc00" />
        <circle cx="384" cy="362" r="14" fill="#ffcc00" />
        <circle cx="278" cy="256" r="14" fill="#ffcc00" />
        <circle cx="490" cy="256" r="14" fill="#ffcc00" />
        <circle cx="309" cy="181" r="14" fill="#ffcc00" />
        <circle cx="459" cy="181" r="14" fill="#ffcc00" />
        <circle cx="309" cy="331" r="14" fill="#ffcc00" />
        <circle cx="459" cy="331" r="14" fill="#ffcc00" />
      </svg>
    </span>
  );
}

/**
 * Bandera de Brasil (Vector SVG con dimensiones estrictas)
 */
export function BrazilFlag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 w-5 h-3.5 min-w-[20px] max-w-[20px] h-[14px] rounded-[2px] overflow-hidden border border-white/10 shadow-xs ${className}`}
    >
      <svg viewBox="0 0 768 512" className="w-full h-full block object-cover">
        <rect width="768" height="512" fill="#009c3b" />
        {/* Rombo amarillo */}
        <polygon points="384,60 700,256 384,452 68,256" fill="#ffdf00" />
        {/* Círculo azul y banda */}
        <circle cx="384" cy="256" r="105" fill="#002776" />
        <path d="M 285 275 A 110 110 0 0 1 483 235" fill="none" stroke="#ffffff" strokeWidth="16" />
      </svg>
    </span>
  );
}
