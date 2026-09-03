"use client";

import * as React from "react";
import { Card, Badge, Button } from "@pulsecommerce/ui";
import { Users, UserPlus, Search, Phone, CreditCard, ShieldCheck } from "lucide-react";
import { MOCK_CUSTOMERS, type Customer } from "@pulsecommerce/contracts";

export function CustomersView() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c: Customer) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.taxId && c.taxId.includes(searchTerm))
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b border-white/[0.06] px-6 flex items-center justify-between bg-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Directorio de Clientes & Cuentas Corrientes
          </h2>
          <Badge variant="outline" className="text-[10px] text-zinc-400">
            {MOCK_CUSTOMERS.length} Clientes
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 shadow-glow h-8 text-xs font-semibold px-3">
            <UserPlus className="h-3.5 w-3.5" />
            <span>Nuevo Cliente</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o CUIT/DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Customers Table / Card List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer: Customer) => (
            <Card key={customer.id} className="p-5 border-white/[0.08] bg-card/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{customer.name}</h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {customer.taxId ? `CUIT/DNI: ${customer.taxId}` : "Consumidor Final"}
                    </p>
                  </div>
                  {customer.hasCreditAccount ? (
                    <Badge variant="success" className="text-[10px]">Cuenta Corriente</Badge>
                  ) : (
                    <Badge variant="neutral" className="text-[10px]">Efectivo/Tarjeta</Badge>
                  )}
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-zinc-300">
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.hasCreditAccount && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Límite Crédito: ${Number(customer.creditLimit || 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-zinc-400">Saldo actual (Fiado):</span>
                <span className={`font-mono font-semibold ${customer.currentBalance > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                  ${Number(customer.currentBalance || 0).toLocaleString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
