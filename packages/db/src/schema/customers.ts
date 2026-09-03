import { pgTable, text, numeric, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  taxId: text('tax_id').unique(), // CUIT, DNI, RUT
  email: text('email'),
  phone: text('phone'),
  address: text('address'),

  // Soporte de Cuenta Corriente / Fiado
  hasCreditAccount: boolean('has_credit_account').notNull().default(false),
  creditLimit: numeric('credit_limit', { precision: 12, scale: 2 }).notNull().default('0.00'),
  currentBalance: numeric('current_balance', { precision: 12, scale: 2 }).notNull().default('0.00'),

  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const customerAccountMovements = pgTable('customer_account_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  saleId: uuid('sale_id'), // Referencia a la venta si fue compra fiada
  type: text('type').notNull(), // 'DEBT' (compra fiada), 'PAYMENT' (entrega/pago de deuda), 'ADJUSTMENT'
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  balanceAfter: numeric('balance_after', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  movements: many(customerAccountMovements),
}));

export const customerAccountMovementsRelations = relations(customerAccountMovements, ({ one }) => ({
  customer: one(customers, {
    fields: [customerAccountMovements.customerId],
    references: [customers.id],
  }),
}));
