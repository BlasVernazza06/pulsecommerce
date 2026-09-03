import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre del cliente es obligatorio'),
  taxId: z.string().nullable().optional(), // CUIT/CUIL/DNI/RUT
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  
  // Cuenta Corriente / Fiado
  hasCreditAccount: z.boolean().default(false),
  creditLimit: z.number().nonnegative().default(0),
  currentBalance: z.number().default(0), // Saldo deudor o a favor
  
  isActive: z.boolean().default(true),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  currentBalance: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
