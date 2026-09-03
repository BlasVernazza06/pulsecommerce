import type { Category } from '../products/category.schema';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '018f6c5a-1111-7000-8000-000000000001',
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Gaseosas, aguas, jugos, cervezas y vinos',
    color: '#3B82F6',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '018f6c5a-2222-7000-8000-000000000002',
    name: 'Snacks & Golosinas',
    slug: 'snacks-golosinas',
    description: 'Papas fritas, galletitas, chocolates y alfajores',
    color: '#F59E0B',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '018f6c5a-3333-7000-8000-000000000003',
    name: 'Almacén',
    slug: 'almacen',
    description: 'Fideos, arroz, aceites, salsas y enlatados',
    color: '#10B981',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '018f6c5a-4444-7000-8000-000000000004',
    name: 'Lácteos & Fiambrería',
    slug: 'lacteos-fiambreria',
    description: 'Leches, yogures, quesos y fiambres',
    color: '#8B5CF6',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '018f6c5a-5555-7000-8000-000000000005',
    name: 'Limpieza & Perfumería',
    slug: 'limpieza-perfumeria',
    description: 'Detergentes, jabones, desodorantes y papel higiénico',
    color: '#EC4899',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];
