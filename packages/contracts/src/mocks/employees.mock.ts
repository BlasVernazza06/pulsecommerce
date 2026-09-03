import type { Employee } from '../employees/employee.schema';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '018f6c5e-0001-7000-8000-000000000001',
    name: 'Carlos Dueño (Propietario)',
    email: 'carlos.owner@pulsecommerce.com',
    username: 'carlos.owner',
    role: 'OWNER',
    pinCode: '9999',
    assignedWarehouseId: null, // Acceso global a todas las sucursales
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '018f6c5e-0002-7000-8000-000000000002',
    name: 'Laura Gerente (Sucursal Central)',
    email: 'laura.manager@pulsecommerce.com',
    username: 'laura.manager',
    role: 'MANAGER',
    pinCode: '1234',
    assignedWarehouseId: '018f6c5a-1111-7000-8000-000000000001', // Fijada a Sucursal 1
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '018f6c5e-0003-7000-8000-000000000003',
    name: 'Lucas Cajero (Turno Mañana)',
    email: 'lucas.cajero@pulsecommerce.com',
    username: 'lucas.cajero',
    role: 'CASHIER',
    pinCode: '1111',
    assignedWarehouseId: '018f6c5a-1111-7000-8000-000000000001',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];
