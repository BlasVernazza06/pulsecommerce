"use client";

import * as React from "react";
import { type EmployeeRole } from "@pulsecommerce/contracts";
import { useAuth } from "@/context/auth-context";

export interface CanProps {
  /**
   * Rol o lista de roles autorizados para ver/ejecutar los elementos hijos.
   * Si no se especifica ningún rol, se permite el acceso por defecto.
   */
  roles?: EmployeeRole[] | readonly EmployeeRole[];
  /**
   * Rol único autorizado (shorthand para `roles={[role]}`).
   */
  role?: EmployeeRole;
  /**
   * Permiso o acción granular (ABAC) para futuras extensiones.
   */
  perform?: string;
  /**
   * Contenido alternativo a renderizar si el usuario NO cuenta con el rol requerido.
   * Por defecto es `null` (no renderiza nada).
   */
  fallback?: React.ReactNode;
  /**
   * Elementos hijos que se renderizan si el usuario está autorizado.
   * Soporta tanto JSX directo como render props.
   */
  children:
    | React.ReactNode
    | ((context: { isAuthorized: boolean; currentRole: EmployeeRole }) => React.ReactNode);
}

/**
 * `<Can />` Componente de Autorización Basada en Roles (RBAC).
 *
 * Permite proteger declarativamente enlaces de navegación, botones de acción
 * destructiva (Supervisor Overrides), o vistas completas según el rol del empleado.
 *
 * @example
 * ```tsx
 * <Can roles={['OWNER', 'MANAGER']}>
 *   <NavLink id="payouts" label="Arqueo & Tesorería" icon={Wallet} />
 * </Can>
 * ```
 */
export function Can({ roles, role, perform, fallback = null, children }: CanProps) {
  const { currentEmployee } = useAuth();
  const currentRole = currentEmployee.role;

  // Si se pasa un solo rol, lo normalizamos a array
  const allowedRoles = React.useMemo(() => {
    if (role) return [role];
    if (roles) return roles;
    return undefined;
  }, [role, roles]);

  // Si no se definieron roles ni acciones, se asume permitido
  const isAuthorized = React.useMemo(() => {
    // Si el usuario es OWNER (Dueño), siempre tiene acceso irrestricto en PulseCommerce
    if (currentRole === "OWNER") {
      return true;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      return allowedRoles.includes(currentRole);
    }

    // Si solo se pasó perform y no hay roles definidos, validar granularmente
    if (perform) {
      // Espacio para lógica extendida de permisos específicos
      return true;
    }

    return true;
  }, [currentRole, allowedRoles, perform]);

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  if (typeof children === "function") {
    return <>{children({ isAuthorized, currentRole })}</>;
  }

  return <>{children}</>;
}
