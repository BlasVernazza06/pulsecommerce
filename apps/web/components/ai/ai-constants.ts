import { type NavTabId } from "@/components/layout/sidebar";

export interface ShortcutItem {
  id: string;
  label: string;
  prompt: string;
}

export const CONTEXT_PLACEHOLDERS: Record<NavTabId, string> = {
  home: "Pregunta sobre ventas, stock o pide una acción... (Ctrl+K)",
  analytics: "Analiza métricas, márgenes o proyecta ventas con IA... (Ctrl+K)",
  customers: "Consulta saldos, historial de compras o fiados... (Ctrl+K)",
  stock: "Audita existencias, busca SKUs o calcula reposición... (Ctrl+K)",
  payouts: "Consulta arqueo de caja, retiros o movimientos... (Ctrl+K)",
  settings: "Configura hardware, impresoras térmicas o reglas... (Ctrl+K)",
  help: "¿Dudas sobre el funcionamiento o atajos del POS?... (Ctrl+K)",
};

export const ALL_SYSTEM_SHORTCUTS: ShortcutItem[] = [
  { id: "ventas", label: "💰 Ventas de hoy", prompt: "¿Cuál es el total facturado hoy y cantidad de tickets emitidos?" },
  { id: "stock", label: "⚠️ Stock crítico", prompt: "Muéstrame los productos que están por debajo del punto de reorden." },
  { id: "cierre", label: "⚡ Cierre estimado", prompt: "Genera un balance preliminar de la caja central para este turno." },
  { id: "top5", label: "📈 Top 5 vendidos", prompt: "¿Cuáles son los 5 productos con mayor volumen de venta este mes?" },
  { id: "reposicion", label: "📦 Reposición sugerida", prompt: "Calcula las unidades a pedir a proveedores según velocidad de rotación." },
  { id: "fiados", label: "💳 Saldos fiados", prompt: "Lista los clientes con saldo deudor en cuenta corriente." },
  { id: "arqueo", label: "🔒 Arqueo del turno", prompt: "Calcula la conciliación entre efectivo en gaveta y cobros registrados." },
  { id: "margen", label: "📊 Margen por categoría", prompt: "Desglosa el margen bruto obtenido por cada rubro de producto." },
  { id: "sin_rotacion", label: "⏳ Sin rotación >30d", prompt: "Lista los SKUs que no registraron ventas en los últimos 30 días." },
  { id: "retiros", label: "🏦 Retiros parciales", prompt: "Detalla las extracciones enviadas a caja fuerte durante este turno." },
  { id: "printer", label: "🖨️ Test impresora", prompt: "Verifica el estado de conexión del daemon local ESC/POS." },
  { id: "teclado", label: "⌨️ Atajos rápidos", prompt: "¿Cuáles son los atajos de teclado para operar caja sin ratón?" },
];

export const CONTEXT_SHORTCUTS: Record<NavTabId, ShortcutItem[]> = {
  home: ALL_SYSTEM_SHORTCUTS,
  analytics: [
    { id: "top5", label: "📈 Top 5 vendidos", prompt: "¿Cuáles son los 5 productos con mayor volumen de venta este mes?" },
    { id: "margen", label: "📊 Margen por categoría", prompt: "Desglosa el margen bruto obtenido por cada rubro de producto." },
    { id: "comparativa", label: "🔄 vs Mes anterior", prompt: "Compara el ticket promedio y volumen frente al mes pasado." },
  ],
  stock: [
    { id: "reposicion", label: "📦 Reposición sugerida", prompt: "Calcula las unidades a pedir a proveedores según velocidad de rotación." },
    { id: "sin_rotacion", label: "⏳ Sin rotación >30d", prompt: "Lista los SKUs que no registraron ventas en los últimos 30 días." },
    { id: "stock_critico", label: "⚠️ Stock crítico", prompt: "Muéstrame los productos que están por debajo del punto de reorden." },
  ],
  customers: [
    { id: "fiados", label: "💳 Saldos fiados", prompt: "Lista los clientes con saldo deudor en cuenta corriente." },
    { id: "limite", label: "🚨 Límites excedidos", prompt: "¿Hay clientes que hayan superado su límite de crédito asignado?" },
  ],
  payouts: [
    { id: "arqueo", label: "🔒 Arqueo del turno", prompt: "Calcula la conciliación entre efectivo en gaveta y cobros registrados." },
    { id: "retiros", label: "🏦 Retiros parciales", prompt: "Detalla las extracciones enviadas a caja fuerte durante este turno." },
  ],
  settings: [
    { id: "printer", label: "🖨️ Test impresora", prompt: "Verifica el estado de conexión del daemon local ESC/POS." },
    { id: "scanner", label: "🎯 Calibrar escáner", prompt: "Comprueba la latencia del buffer de interrupción de teclado (HID)." },
  ],
  help: [
    { id: "teclado", label: "⌨️ Atajos rápidos", prompt: "¿Cuáles son los atajos de teclado para operar caja sin ratón?" },
    { id: "offline", label: "📡 Modo Local-First", prompt: "¿Cómo funciona el outbox de transacciones sin conexión?" },
  ],
};
