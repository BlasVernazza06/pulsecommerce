"use client";

import * as React from "react";
import { type EmployeeRole, type Employee, MOCK_EMPLOYEES } from "@pulsecommerce/contracts";

interface AuthContextType {
  currentEmployee: Employee;
  setRole: (role: EmployeeRole) => void;
  availableRoles: EmployeeRole[];
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos con el usuario OWNER (Dueño) por defecto desde los mocks del contrato
  const [currentEmployee, setCurrentEmployee] = React.useState<Employee>(
    MOCK_EMPLOYEES[0] || {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Blas Vernazza",
      email: "admin@pulsecommerce.com",
      username: "bvernazza",
      role: "OWNER" as EmployeeRole,
      assignedWarehouseId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const availableRoles: EmployeeRole[] = [
    "OWNER",
    "MANAGER",
    "CASHIER",
    "STOCK_CLERK",
  ];

  const setRole = React.useCallback((role: EmployeeRole) => {
    // Buscamos si existe un mock con ese rol o clonamos con el nuevo rol
    const mockUser = MOCK_EMPLOYEES.find((e) => e.role === role);
    if (mockUser) {
      setCurrentEmployee(mockUser);
    } else {
      setCurrentEmployee((prev) => ({
        ...prev,
        role,
      }));
    }
  }, []);

  const value = React.useMemo(
    () => ({
      currentEmployee,
      setRole,
      availableRoles,
    }),
    [currentEmployee, setRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un <AuthProvider />");
  }
  return context;
}
