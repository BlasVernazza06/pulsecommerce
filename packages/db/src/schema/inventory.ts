import { pgTable, text, numeric, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';

export const warehouses = pgTable('warehouses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(), // Ej: "SUC-CENTRAL"
  address: text('address'),
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const inventoryStock = pgTable('inventory_stock', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull().default('0.000'),
  reservedQuantity: numeric('reserved_quantity', { precision: 12, scale: 3 }).notNull().default('0.000'),
  minStockAlert: integer('min_stock_alert').notNull().default(5),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'restrict' }),
  type: text('type').notNull(), // 'SALE', 'PURCHASE_OCR', 'MANUAL_IN', 'MANUAL_OUT', etc.
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull(),
  previousStock: numeric('previous_stock', { precision: 12, scale: 3 }).notNull(),
  newStock: numeric('new_stock', { precision: 12, scale: 3 }).notNull(),
  referenceId: text('reference_id'), // ID de la Venta o Remito/Factura OCR
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  stock: many(inventoryStock),
  movements: many(stockMovements),
}));

export const inventoryStockRelations = relations(inventoryStock, ({ one }) => ({
  product: one(products, {
    fields: [inventoryStock.productId],
    references: [products.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventoryStock.warehouseId],
    references: [warehouses.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  warehouse: one(warehouses, {
    fields: [stockMovements.warehouseId],
    references: [warehouses.id],
  }),
}));
