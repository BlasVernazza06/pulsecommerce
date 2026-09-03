import { z } from 'zod';
import { CategorySchema } from './category.schema';

export const BarcodeTypeEnum = z.enum(['EAN13', 'EAN8', 'UPCA', 'CODE128', 'QR', 'CUSTOM']);
export type BarcodeType = z.infer<typeof BarcodeTypeEnum>;

export const ProductBarcodeSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  code: z.string().min(1, 'El código de barras no puede estar vacío'),
  type: BarcodeTypeEnum.default('EAN13'),
  isPrimary: z.boolean().default(false),
});
export type ProductBarcode = z.infer<typeof ProductBarcodeSchema>;

export const ProductSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(1, 'El SKU es obligatorio'),
  name: z.string().min(1, 'El nombre del producto es obligatorio'),
  description: z.string().nullable().optional(),
  primaryBarcode: z.string().min(1, 'El código de barras principal es requerido'),
  barcodes: z.array(ProductBarcodeSchema).default([]),
  
  // Precios y Costos (en formato decimal numérico)
  price: z.number().positive('El precio debe ser mayor a 0'),
  costPrice: z.number().nonnegative('El costo no puede ser negativo'),
  taxRate: z.number().nonnegative('La alícuota de impuesto debe ser positiva').default(0.21), // 21% IVA estándar
  
  // Stock y Control de Inventario
  stock: z.number().int('El stock debe ser un entero').default(0),
  minStockAlert: z.number().int().nonnegative().default(5),
  allowFractionalQty: z.boolean().default(false), // Para productos por peso/granel (ej: fiambrería, verdulería)
  unit: z.enum(['UNIT', 'KG', 'LITER', 'METER']).default('UNIT'),

  categoryId: z.string().uuid().nullable().optional(),
  category: CategorySchema.nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().default(true),

  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  category: true,
}).extend({
  barcodes: z.array(ProductBarcodeSchema.omit({ productId: true, id: true })).default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Representación de un ítem en el Carrito del POS
export const CartItemSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string(),
  name: z.string(),
  unitPrice: z.number().positive(),
  costPrice: z.number().nonnegative(),
  quantity: z.number().positive(),
  taxRate: z.number().nonnegative().default(0.21),
  discountPercent: z.number().min(0).max(100).default(0),
  subtotal: z.number().nonnegative(),
  notes: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
