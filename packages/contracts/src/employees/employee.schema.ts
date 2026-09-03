import { z } from 'zod';

/**
 * Jerarquía de roles en PulseCommerce:
 * - OWNER: Dueño / Superadmin. Acceso irrestricto, dashboard consolidado, auditoría y eliminación de productos.
 * - MANAGER: Encargado de sucursal. Gestiona su local asignado, aprueba anulaciones en caja y arqueos.
 * - CASHIER: Cajero. Opera terminal de ventas POS, cobro, apertura y cierre de turno. No elimina productos ni ve costos.
 * - STOCK_CLERK: Encargado de depósito/inventario. Recepción de compras/OCR, conteo físico y ajustes.
 */
export const EmployeeRoleEnum = z.enum([
  'OWNER',
  'MANAGER',
  'CASHIER',
  'STOCK_CLERK',
]);
export type EmployeeRole = z.infer<typeof EmployeeRoleEnum>;

export const EmployeeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre del empleado es requerido'),
  email: z.string().email('Email inválido').nullable().optional(),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  role: EmployeeRoleEnum,
  
  // PIN de 4 a 6 dígitos para autorizaciones rápidas en caja (ej: supervisor autorizando descuento)
  pinCode: z.string().regex(/^\d{4,6}$/, 'El PIN debe contener entre 4 y 6 dígitos numéricos').optional(),
  
  // Sucursal asignada (si es null, tiene alcance global como el Dueño)
  assignedWarehouseId: z.string().uuid().nullable().optional(),
  
  isActive: z.boolean().default(true),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const CreateEmployeeSchema = EmployeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

// Esquema para autorización rápida en pantalla (Supervisor Override)
export const SupervisorAuthorizeActionSchema = z.object({
  supervisorPin: z.string().regex(/^\d{4,6}$/),
  action: z.enum([
    'DELETE_PRODUCT',
    'CANCEL_SALE',
    'APPLY_CUSTOM_DISCOUNT',
    'OPEN_CASH_DRAWER_MANUAL',
    'VIEW_GLOBAL_DASHBOARD',
  ]),
  reason: z.string().min(3, 'Se requiere un motivo para la autorización'),
});

export type Employee = z.infer<typeof EmployeeSchema>;
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>;
export type SupervisorAuthorizeAction = z.infer<typeof SupervisorAuthorizeActionSchema>;
