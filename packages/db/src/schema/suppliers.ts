import { pgTable, text, numeric, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { warehouses } from './inventory';
import { products } from './products';
import { employees } from './employees';

export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  taxId: text('tax_id').notNull().unique(), // CUIT, RUT o Identificación Fiscal
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  contactPerson: text('contact_person'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const purchaseInvoices = pgTable('purchase_invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  supplierId: uuid('supplier_id').references(() => suppliers.id, { onDelete: 'set null' }),
  invoiceNumber: text('invoice_number').notNull(),
  invoiceDate: timestamp('invoice_date').notNull(),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'restrict' }),
  documentUrl: text('document_url'), // Link a Storage (S3 / Local) del PDF o imagen
  
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  taxTotal: numeric('tax_total', { precision: 12, scale: 2 }).notNull(),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),

  // Estado de Ingesta OCR: 'PENDING_REVIEW' | 'CONFIRMED' | 'REJECTED'
  status: text('status').notNull().default('PENDING_REVIEW'),
  processedByAi: boolean('processed_by_ai').notNull().default(true),
  reviewedByUserId: uuid('reviewed_by_user_id').references(() => employees.id, { onDelete: 'set null' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const purchaseInvoiceItems = pgTable('purchase_invoice_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').notNull().references(() => purchaseInvoices.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  rawDescription: text('raw_description').notNull(),
  skuDetected: text('sku_detected'),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull(),
  unitCost: numeric('unit_cost', { precision: 12, scale: 2 }).notNull(),
  taxRate: numeric('tax_rate', { precision: 5, scale: 4 }).notNull().default('0.2100'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  isMatchedWithCatalog: boolean('is_matched_with_catalog').notNull().default(false),
});

// Relaciones Drizzle ORM
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  invoices: many(purchaseInvoices),
}));

export const purchaseInvoicesRelations = relations(purchaseInvoices, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [purchaseInvoices.supplierId],
    references: [suppliers.id],
  }),
  warehouse: one(warehouses, {
    fields: [purchaseInvoices.warehouseId],
    references: [warehouses.id],
  }),
  reviewer: one(employees, {
    fields: [purchaseInvoices.reviewedByUserId],
    references: [employees.id],
  }),
  items: many(purchaseInvoiceItems),
}));

export const purchaseInvoiceItemsRelations = relations(purchaseInvoiceItems, ({ one }) => ({
  invoice: one(purchaseInvoices, {
    fields: [purchaseInvoiceItems.invoiceId],
    references: [purchaseInvoices.id],
  }),
  product: one(products, {
    fields: [purchaseInvoiceItems.productId],
    references: [products.id],
  }),
}));
