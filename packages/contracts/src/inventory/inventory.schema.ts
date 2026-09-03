import { z } from 'zod';

export const WarehouseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre del depósito/sucursal es requerido'),
  code: z.string().min(1), // Ej: "SUC-01", "DEP-CENTRAL"
  address: z.string().nullable().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type Warehouse = z.infer<typeof WarehouseSchema>;

export const StockMovementTypeEnum = z.enum([
  'SALE',               // Descuento automático por venta en POS
  'PURCHASE_OCR',       // Ingreso por factura/remito digitalizado con IA
  'MANUAL_IN',          // Ingreso manual
  'MANUAL_OUT',         // Egreso manual / Pérdida / Merma
  'INVENTORY_AUDIT',    // Ajuste por recuento físico
  'TRANSFER_IN',        // Transferencia entrante
  'TRANSFER_OUT',       // Transferencia saliente
]);
export type StockMovementType = z.infer<typeof StockMovementTypeEnum>;

export const StockMovementSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  type: StockMovementTypeEnum,
  quantity: z.number(), // Positivo (ingreso) o Negativo (egreso)
  previousStock: z.number(),
  newStock: z.number(),
  referenceId: z.string().nullable().optional(), // ID de la Venta o ID de la Factura OCR
  reason: z.string().nullable().optional(),
  createdBy: z.string().uuid(),
  createdAt: z.date().or(z.string()),
});
export type StockMovement = z.infer<typeof StockMovementSchema>;

export const StockLevelSchema = z.object({
  productId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  quantity: z.number().default(0),
  reservedQuantity: z.number().default(0),
  minStockAlert: z.number().default(5),
  updatedAt: z.date().or(z.string()),
});
export type StockLevel = z.infer<typeof StockLevelSchema>;
