import { MOCK_PRODUCTS } from './products.mock';
import type { Product } from '../products/product.schema';

export * from './categories.mock';
export * from './products.mock';
export * from './customers.mock';
export * from './employees.mock';
export * from './suppliers.mock';

/**
 * Helper ultrarrápido para buscar producto por código de barras (simula escáner HID o cámara)
 */
export function findMockProductByBarcode(barcode: string): Product | undefined {
  const cleanCode = barcode.trim();
  return MOCK_PRODUCTS.find(
    (p) =>
      p.primaryBarcode === cleanCode ||
      p.barcodes.some((b) => b.code === cleanCode)
  );
}

/**
 * Helper para búsqueda en vivo en la paleta de comandos / buscador del POS (F2 / Ctrl+K)
 */
export function searchMockProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_PRODUCTS;

  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.primaryBarcode.includes(q) ||
      (p.category?.name.toLowerCase().includes(q) ?? false)
  );
}
