import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { warehouses } from './inventory';

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  passwordHash: text('password_hash'), // Para login web completo
  
  // Jerarquía de Roles: 'OWNER' | 'MANAGER' | 'CASHIER' | 'STOCK_CLERK'
  role: text('role').notNull().default('CASHIER'),
  
  // PIN de 4-6 dígitos para autorizaciones rápidas en terminal de caja (Supervisor Override)
  pinCode: text('pin_code'),
  
  // Sucursal asignada (si es NULL, es de alcance global, ej: OWNER)
  assignedWarehouseId: uuid('assigned_warehouse_id').references(() => warehouses.id, { onDelete: 'set null' }),
  
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Auditoría de autorizaciones supervisor en caja (anulaciones, descuentos extraordinarios, borrado)
export const supervisorAuditLogs = pgTable('supervisor_audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  supervisorId: uuid('supervisor_id').notNull().references(() => employees.id, { onDelete: 'restrict' }),
  cashierId: uuid('cashier_id').notNull().references(() => employees.id, { onDelete: 'restrict' }),
  action: text('action').notNull(), // 'DELETE_PRODUCT', 'CANCEL_SALE', 'APPLY_CUSTOM_DISCOUNT', etc.
  reason: text('reason').notNull(),
  referenceId: text('reference_id'), // ID del producto eliminado o venta cancelada
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const employeesRelations = relations(employees, ({ one, many }) => ({
  assignedWarehouse: one(warehouses, {
    fields: [employees.assignedWarehouseId],
    references: [warehouses.id],
  }),
  supervisorLogs: many(supervisorAuditLogs, { relationName: 'supervisor' }),
  cashierLogs: many(supervisorAuditLogs, { relationName: 'cashier' }),
}));

export const supervisorAuditLogsRelations = relations(supervisorAuditLogs, ({ one }) => ({
  supervisor: one(employees, {
    fields: [supervisorAuditLogs.supervisorId],
    references: [employees.id],
    relationName: 'supervisor',
  }),
  cashier: one(employees, {
    fields: [supervisorAuditLogs.cashierId],
    references: [employees.id],
    relationName: 'cashier',
  }),
}));
