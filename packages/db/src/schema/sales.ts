import { pgTable, text, numeric, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { customers } from './customers';
import { warehouses } from './inventory';
import { employees } from './employees';

export const cashShifts = pgTable('cash_shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  cashierId: uuid('cashier_id').notNull().references(() => employees.id, { onDelete: 'restrict' }),
  terminalId: text('terminal_id').notNull().default('TERMINAL-1'),
  warehouseId: uuid('warehouse_id').references(() => warehouses.id, { onDelete: 'set null' }),
  initialCash: numeric('initial_cash', { precision: 12, scale: 2 }).notNull().default('0.00'),
  declaredCashAtClose: numeric('declared_cash_at_close', { precision: 12, scale: 2 }),
  systemExpectedCash: numeric('system_expected_cash', { precision: 12, scale: 2 }),
  cashDifference: numeric('cash_difference', { precision: 12, scale: 2 }),
  status: text('status').notNull().default('OPEN'), // OPEN, CLOSED
  openedAt: timestamp('opened_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at'),
  notes: text('notes'),
});

export const sales = pgTable('sales', {
  id: uuid('id').primaryKey().defaultRandom(), // UUID v7 generado en cliente offline o servidor
  ticketNumber: text('ticket_number').notNull().unique(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'set null' }),
  cashierId: uuid('cashier_id').notNull().references(() => employees.id, { onDelete: 'restrict' }),
  shiftId: uuid('shift_id').references(() => cashShifts.id, { onDelete: 'set null' }),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'restrict' }),
  
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  taxTotal: numeric('tax_total', { precision: 12, scale: 2 }).notNull(),
  discountTotal: numeric('discount_total', { precision: 12, scale: 2 }).notNull().default('0.00'),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),

  status: text('status').notNull().default('COMPLETED'), // COMPLETED, CANCELLED, REFUNDED
  syncStatus: text('sync_status').notNull().default('SYNCED'), // PENDING, SYNCED, FAILED
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const saleItems = pgTable('sale_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  saleId: uuid('sale_id').notNull().references(() => sales.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
  sku: text('sku').notNull(),
  name: text('name').notNull(),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull(),
  taxRate: numeric('tax_rate', { precision: 5, scale: 4 }).notNull().default('0.2100'),
  discountPercent: numeric('discount_percent', { precision: 5, scale: 2 }).notNull().default('0.00'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  saleId: uuid('sale_id').notNull().references(() => sales.id, { onDelete: 'cascade' }),
  method: text('method').notNull(), // 'CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'QR', 'CURRENT_ACCOUNT'
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  receivedAmount: numeric('received_amount', { precision: 12, scale: 2 }),
  changeAmount: numeric('change_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  referenceCode: text('reference_code'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relaciones Drizzle ORM
export const cashShiftsRelations = relations(cashShifts, ({ one, many }) => ({
  sales: many(sales),
  cashier: one(employees, {
    fields: [cashShifts.cashierId],
    references: [employees.id],
  }),
  warehouse: one(warehouses, {
    fields: [cashShifts.warehouseId],
    references: [warehouses.id],
  }),
}));

export const salesRelations = relations(sales, ({ one, many }) => ({
  customer: one(customers, {
    fields: [sales.customerId],
    references: [customers.id],
  }),
  cashier: one(employees, {
    fields: [sales.cashierId],
    references: [employees.id],
  }),
  warehouse: one(warehouses, {
    fields: [sales.warehouseId],
    references: [warehouses.id],
  }),
  shift: one(cashShifts, {
    fields: [sales.shiftId],
    references: [cashShifts.id],
  }),
  items: many(saleItems),
  payments: many(payments),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
  product: one(products, {
    fields: [saleItems.productId],
    references: [products.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  sale: one(sales, {
    fields: [payments.saleId],
    references: [sales.id],
  }),
}));
