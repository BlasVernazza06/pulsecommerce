"use client";

import * as React from "react";
import {
  Home,
  BarChart3,
  Users,
  Wallet,
  Settings,
  HelpCircle,
  ChevronsUpDown,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  UserCheck,
} from "lucide-react";
import { Badge, Button } from "@pulsecommerce/ui";
import { type EmployeeRole } from "@pulsecommerce/contracts";
import { useAuth } from "@/context/auth-context";
import { Can } from "@/components/auth/can";
import { NavLink } from "@/components/navigation/nav-link";

export type NavTabId = "home" | "analytics" | "customers" | "stock" | "payouts" | "settings" | "help";

export interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const { currentEmployee, setRole, availableRoles } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  return (
    <aside className="w-64 flex flex-col justify-between p-2 shrink-0 h-full select-none">
      <div className="space-y-6">
        {/* Workspace & Role Switcher Header */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu((prev) => !prev)}
            className="w-full flex items-center justify-between p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.1] text-white font-bold text-sm">
                #
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5 truncate">
                  PulseCommerce
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] text-zinc-400 truncate">
                  {currentEmployee.name} ({currentEmployee.role})
                </span>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" />
          </button>

          {/* Quick Role Switcher Dropdown (Simulador RBAC) */}
          {showRoleMenu && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-zinc-950/95 backdrop-blur-md border border-white/[0.12] rounded-xl shadow-2xl z-50 space-y-1">
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                Simular Rol de Empleado
              </div>
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currentEmployee.role === role
                      ? "bg-white/10 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{role}</span>
                  {currentEmployee.role === role && (
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Core Engine Status */}
        <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
          <span>POS Core Engine</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono font-medium">Local-First</span>
          </div>
        </div>

        {/* Navigation Links agrupados con <Can /> por Rol */}
        <nav className="space-y-1" role="tablist">
          {/* Terminal & Home: Accesible para todos */}
          <Can roles={["OWNER", "MANAGER", "CASHIER", "STOCK_CLERK"]}>
            <NavLink
              id="home"
              label="Terminal & Home"
              icon={Home}
              isActive={activeTab === "home"}
              onClick={() => onSelectTab("home")}
              shortcut="F1"
            />
          </Can>

          {/* Analytics: Dueños y Encargados */}
          <Can roles={["OWNER", "MANAGER"]}>
            <NavLink
              id="analytics"
              label="Analiticas"
              icon={BarChart3}
              isActive={activeTab === "analytics"}
              onClick={() => onSelectTab("analytics")}
            />
          </Can>

          {/* Clientes & Cuentas Corrientes: Dueños, Encargados y Cajeros */}
          <Can roles={["OWNER", "MANAGER", "CASHIER"]}>
            <NavLink
              id="customers"
              label="Clientes"
              icon={Users}
              isActive={activeTab === "customers"}
              onClick={() => onSelectTab("customers")}
              badge={
                <Badge variant="neutral" className="text-[10px] px-1.5 py-0 h-4">
                  6
                </Badge>
              }
            />
          </Can>

          {/* Inventario & Stock: Dueños, Encargados y Repositores */}
          <Can roles={["OWNER", "MANAGER", "STOCK_CLERK"]}>
            <NavLink
              id="stock"
              label="Inventario"
              icon={ShoppingBag}
              isActive={activeTab === "stock"}
              onClick={() => onSelectTab("stock")}
              badge={
                <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4">
                  New
                </Badge>
              }
            />
          </Can>

          {/* Arqueo & Tesorería: Dueños, Encargados y Cajeros */}
          <Can roles={["OWNER", "MANAGER", "CASHIER"]}>
            <NavLink
              id="payouts"
              label="Arqueo & Tesorería"
              icon={Wallet}
              isActive={activeTab === "payouts"}
              onClick={() => onSelectTab("payouts")}
            />
          </Can>
        </nav>
      </div>

      {/* Bottom Section: Callout Card & Settings */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="success" dot pulse className="text-[10px]">
              HITL AI Ready
            </Badge>
            <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <p className="text-xs font-medium text-zinc-200">Voice POS & Asistente</p>
          <p className="text-[11px] text-zinc-400">
            Control por voz ultrarrápido con confirmación interactiva.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-7 gap-1.5 mt-1 border-white/[0.1] bg-white/[0.04]"
          >
            <span>Configurar</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="pt-2 border-t border-white/[0.06] space-y-0.5">
          {/* Ajustes del sistema: Dueños y Encargados */}
          <Can roles={["OWNER", "MANAGER"]}>
            <NavLink
              id="settings"
              label="Ajustes del Sistema"
              icon={Settings}
              isActive={activeTab === "settings"}
              onClick={() => onSelectTab("settings")}
            />
          </Can>

          {/* Centro de Ayuda: Todos los usuarios */}
          <NavLink
            id="help"
            label="Centro de Ayuda"
            icon={HelpCircle}
            isActive={activeTab === "help"}
            onClick={() => onSelectTab("help")}
          />
        </div>
      </div>
    </aside>
  );
}
