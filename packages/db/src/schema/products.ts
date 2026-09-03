import { pgTable, text, numeric, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  primaryBarcode: text('primary_barcode').notNull().unique(),
  
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  taxRate: numeric('tax_rate', { precision: 5, scale: 4 }).notNull().default('0.2100'), // 0.2100 = 21%
  
  stock: integer('stock').notNull().default(0),
  minStockAlert: integer('min_stock_alert').notNull().default(5),
  allowFractionalQty: boolean('allow_fractional_qty').notNull().default(false),
  unit: text('unit').notNull().default('UNIT'), // UNIT, KG, LITER, METER

  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').notNull().default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productBarcodes = pgTable('product_barcodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(),
  type: text('type').notNull().default('EAN13'),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relaciones Drizzle ORM
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  barcodes: many(productBarcodes),
}));

export const productBarcodesRelations = relations(productBarcodes, ({ one }) => ({
  product: one(products, {
    fields: [productBarcodes.productId],
    references: [products.id],
  }),
}));
