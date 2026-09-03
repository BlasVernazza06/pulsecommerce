import { z } from 'zod';

// 1. Proveedor
export const SupplierSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'La razón social o nombre del proveedor es obligatorio'),
  taxId: z.string().min(1, 'El CUIT / RUT / Tax ID es obligatorio'), // CUIT del proveedor
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  contactPerson: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

// 2. Estados de la Ingesta de Factura (Human-in-the-Loop)
export const PurchaseInvoiceStatusEnum = z.enum([
  'PENDING_REVIEW', // Extraído por IA, esperando confirmación humana en pantalla
  'CONFIRMED',      // Aprobado: ya impactó costos y sumó stock
  'REJECTED',       // Rechazado por el usuario
]);
export type PurchaseInvoiceStatus = z.infer<typeof PurchaseInvoiceStatusEnum>;

// 3. Línea individual de la Factura detectada por OCR
export const PurchaseInvoiceItemSchema = z.object({
  id: z.string().uuid().optional(),
  invoiceId: z.string().uuid().optional(),
  productId: z.string().uuid().nullable().optional(), // ID del producto en nuestro catálogo (si hubo coincidencia)
  rawDescription: z.string().min(1),                   // Texto tal cual lo leyó la IA en el papel
  skuDetected: z.string().nullable().optional(),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unitCost: z.number().positive('El costo unitario debe ser positivo'),
  taxRate: z.number().nonnegative().default(0.21),
  subtotal: z.number().positive(),
  isMatchedWithCatalog: z.boolean().default(false),    // Indica si se asoció a un producto existente
});

// 4. Encabezado de Factura de Compra
export const PurchaseInvoiceSchema = z.object({
  id: z.string().uuid(),
  supplierId: z.string().uuid().nullable().optional(),
  invoiceNumber: z.string().min(1, 'El número de comprobante es requerido'), // Ej: "FC-A-0001-00004589"
  invoiceDate: z.date().or(z.string()),
  warehouseId: z.string().uuid(),                      // Depósito donde ingresa la mercadería
  documentUrl: z.string().url().nullable().optional(), // URL del archivo PDF o imagen original
  
  items: z.array(PurchaseInvoiceItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  taxTotal: z.number().nonnegative(),
  total: z.number().positive(),
  
  status: PurchaseInvoiceStatusEnum.default('PENDING_REVIEW'),
  processedByAi: z.boolean().default(true),
  reviewedByUserId: z.string().uuid().nullable().optional(),
  
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type Supplier = z.infer<typeof SupplierSchema>;
export type PurchaseInvoice = z.infer<typeof PurchaseInvoiceSchema>;
export type PurchaseInvoiceItem = z.infer<typeof PurchaseInvoiceItemSchema>;