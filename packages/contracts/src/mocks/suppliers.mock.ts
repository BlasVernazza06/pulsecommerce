import type { Supplier, PurchaseInvoice } from '../suppliers/supplier.schema';

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '018f6c5f-1111-7000-8000-000000000001',
    name: 'Distribuidora Arcor S.A.',
    taxId: '30-50279317-5',
    email: 'pedidos@arcor-distribucion.com',
    phone: '+54 11 4321-0000',
    address: 'Av. Libertador 5000, CABA',
    contactPerson: 'Martín Repositor',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '018f6c5f-1111-7000-8000-000000000002',
    name: 'Cervecería y Maltería Quilmes S.A.',
    taxId: '30-50001234-8',
    email: 'ventas@quilmes.com.ar',
    phone: '+54 11 4567-8900',
    address: 'Av. 12 de Octubre 100, Quilmes',
    contactPerson: 'Carlos Distribuidor',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];

export const MOCK_PENDING_INVOICE: PurchaseInvoice = {
  id: '018f6c5f-2222-7000-8000-000000000001',
  supplierId: '018f6c5f-1111-7000-8000-000000000001',
  invoiceNumber: 'FC-A-0005-00012840',
  invoiceDate: new Date('2026-03-01'),
  warehouseId: '018f6c5a-1111-7000-8000-000000000001',
  documentUrl: 'https://example.com/invoices/arcor-factura-00012840.pdf',
  
  items: [
    {
      id: '018f6c5f-3333-7000-8000-000000000001',
      invoiceId: '018f6c5f-2222-7000-8000-000000000001',
      productId: '018f6c5b-9d47-7000-8000-000000000005', // Match con Alfajor Havanna
      rawDescription: 'ALF HAVANNA 70% CACAO X 24 UN',
      skuDetected: 'SNK-ALF-HAV',
      quantity: 24,
      unitCost: 1750.0,
      taxRate: 0.21,
      subtotal: 42000.0,
      isMatchedWithCatalog: true,
    },
    {
      id: '018f6c5f-3333-7000-8000-000000000002',
      invoiceId: '018f6c5f-2222-7000-8000-000000000001',
      productId: '018f6c5b-9d47-7000-8000-000000000004', // Match con Papas Lays 95g
      rawDescription: 'PAPAS FRITAS LAYS CLASICA 95G X 12',
      skuDetected: 'SNK-LAY-L95',
      quantity: 12,
      unitCost: 1480.0,
      taxRate: 0.21,
      subtotal: 17760.0,
      isMatchedWithCatalog: true,
    },
  ],
  subtotal: 59760.0,
  taxTotal: 12549.6,
  total: 72309.6,
  status: 'PENDING_REVIEW',
  processedByAi: true,
  reviewedByUserId: null,
  createdAt: new Date('2026-03-01'),
  updatedAt: new Date('2026-03-01'),
};
