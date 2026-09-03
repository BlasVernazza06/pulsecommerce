import { z } from 'zod';
import { CartItemSchema } from '../products/product.schema';

export const PaymentMethodEnum = z.enum([
  'CASH',             // Efectivo
  'DEBIT_CARD',       // Tarjeta de Débito
  'CREDIT_CARD',      // Tarjeta de Crédito
  'QR',               // QR Interoperable / Billeteras
  'CURRENT_ACCOUNT',  // Cuenta Corriente / Fiado
  'TRANSFER',         // Transferencia bancaria
]);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

export const SaleStatusEnum = z.enum([
  'COMPLETED',  // Completada
  'CANCELLED',  // Anulada
  'DRAFT',      // Borrador / Carrito en espera
  'REFUNDED',   // Reembolsada
]);
export type SaleStatus = z.infer<typeof SaleStatusEnum>;

export const SyncStatusEnum = z.enum([
  'PENDING',    // Guardado localmente en Dexie.js, pendiente de sincronizar
  'SYNCED',     // Sincronizado exitosamente con el backend
  'FAILED',     // Error en la sincronización
]);
export type SyncStatus = z.infer<typeof SyncStatusEnum>;

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  saleId: z.string().uuid(),
  method: PaymentMethodEnum,
  amount: z.number().positive('El monto pagado debe ser positivo'),
  receivedAmount: z.number().positive().optional(), // Efectivo entregado por el cliente
  changeAmount: z.number().nonnegative().default(0),  // Vuelto entregado
  referenceCode: z.string().nullable().optional(),   // Cupón de tarjeta / Ref transferencia
  createdAt: z.date().or(z.string()),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const SaleItemSchema = CartItemSchema.extend({
  id: z.string().uuid(),
  saleId: z.string().uuid(),
});
export type SaleItem = z.infer<typeof SaleItemSchema>;

export const SaleSchema = z.object({
  id: z.string().uuid(), // UUID v7
  ticketNumber: z.string(), // Ej: "A-0001-00001234"
  customerId: z.string().uuid().nullable().optional(),
  cashierId: z.string().uuid(), // ID del cajero/empleado
  shiftId: z.string().uuid().nullable().optional(), // ID del turno de caja
  warehouseId: z.string().uuid(), // Sucursal donde se emitió la venta (clave para dashboards por local)
  
  items: z.array(SaleItemSchema).min(1, 'La venta debe contener al menos un producto'),
  payments: z.array(PaymentSchema).min(1, 'Debe registrarse al menos un método de pago'),
  
  subtotal: z.number().nonnegative(),
  taxTotal: z.number().nonnegative(),
  discountTotal: z.number().nonnegative().default(0),
  total: z.number().positive('El total debe ser mayor a 0'),

  status: SaleStatusEnum.default('COMPLETED'),
  syncStatus: SyncStatusEnum.default('SYNCED'),
  
  notes: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});
export type Sale = z.infer<typeof SaleSchema>;

export const CreateSaleSchema = z.object({
  id: z.string().uuid().optional(), // Si viene del frontend offline, vendrá con UUID v7 generado en Dexie
  customerId: z.string().uuid().nullable().optional(),
  cashierId: z.string().uuid(),
  shiftId: z.string().uuid().nullable().optional(),
  warehouseId: z.string().uuid(),
  items: z.array(CartItemSchema).min(1, 'El carrito debe tener al menos un ítem'),
  payments: z.array(PaymentSchema.omit({ id: true, saleId: true, createdAt: true })).min(1),
  discountTotal: z.number().nonnegative().default(0),
  notes: z.string().nullable().optional(),
});
export type CreateSale = z.infer<typeof CreateSaleSchema>;

// Turno de Caja (Arqueo / Cierre ciego)
export const CashShiftStatusEnum = z.enum(['OPEN', 'CLOSED']);
export type CashShiftStatus = z.infer<typeof CashShiftStatusEnum>;

export const CashShiftSchema = z.object({
  id: z.string().uuid(),
  cashierId: z.string().uuid(),
  terminalId: z.string().default('TERMINAL-1'),
  warehouseId: z.string().uuid().optional(),
  initialCash: z.number().nonnegative('El monto inicial no puede ser negativo'),
  declaredCashAtClose: z.number().nonnegative().nullable().optional(), // Cierre ciego
  systemExpectedCash: z.number().nonnegative().nullable().optional(),   // Calculado por sistema
  cashDifference: z.number().nullable().optional(),                    // Discrepancia
  status: CashShiftStatusEnum.default('OPEN'),
  openedAt: z.date().or(z.string()),
  closedAt: z.date().or(z.string()).nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type CashShift = z.infer<typeof CashShiftSchema>;
