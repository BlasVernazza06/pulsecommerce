"use client";

import * as React from "react";
import { Badge } from "@pulsecommerce/ui";
import {
  ShoppingBag,
  Plus,
  AlertTriangle,
  Layers,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  SlidersHorizontal,
  Trash2,
  Printer,
  Copy,
  Check,
} from "lucide-react";
import { MOCK_PRODUCTS, type Product } from "@pulsecommerce/contracts";
import { AddProductModal } from "./add-product-modal";

type SortOrder = "none" | "price_desc" | "price_asc";

export function InventoryView() {
  // Estado local de productos
  const [products, setProducts] = React.useState<Product[]>(MOCK_PRODUCTS);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);

  // Estado para búsqueda y filtros
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("none");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Estado para el menú de acción desplegado (id del producto activo)
  const [activeMenuProductId, setActiveMenuProductId] = React.useState<string | null>(null);
  const [copiedSku, setCopiedSku] = React.useState<string | null>(null);

  // Estado para paginación (6 productos por página)
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 6;

  // Handler para agregar producto nuevo en memoria
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setCurrentPage(1);
  };

  // Atajo global para enfocar búsqueda con F2 o '/'
  React.useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (
        (e.key === "F2" || (e.key === "/" && (e.target as HTMLElement)?.tagName !== "INPUT" && (e.target as HTMLElement)?.tagName !== "TEXTAREA"))
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setActiveMenuProductId(null);
      }
    };
    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, []);

  // Cerrar menú contextual al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuProductId && !(e.target as HTMLElement).closest(".product-action-menu-container")) {
        setActiveMenuProductId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuProductId]);

  // Filtrado y ordenamiento memorizado O(N log N)
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...products];

    // 1. Filtrado por cualquier campo relevante (nombre, SKU, código de barras, categoría)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((p) => {
        const matchName = p.name.toLowerCase().includes(term);
        const matchSku = p.sku.toLowerCase().includes(term);
        const matchBarcode = p.primaryBarcode.toLowerCase().includes(term);
        const matchCategory = p.category?.name.toLowerCase().includes(term) || false;
        return matchName || matchSku || matchBarcode || matchCategory;
      });
    }

    // 2. Ordenamiento por precio
    if (sortOrder === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [products, searchTerm, sortOrder]);

  // Cálculo de paginación
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / itemsPerPage));

  // Ajustar página si la búsqueda reduce los resultados
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Productos para la página actual
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setActiveMenuProductId(null);
    }
  };

  const copySkuToClipboard = (sku: string) => {
    navigator.clipboard?.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 1500);
  };

  // Formateador de fecha legible en español
  const formatDate = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "12 Oct 2025";
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black text-white">
      {/* Header Superior del Módulo con bg-[#09090b]/80 backdrop-blur-xl */}
      <header className="h-16 border-b border-white/[0.08] px-6 flex items-center justify-between bg-black backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Inventario & Stock Multidepósito
          </h2>
          <Badge variant="outline" className="text-[10px] text-zinc-400 border-white/[0.08] bg-[#09090b]">
            {products.length} Productos
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Agregar Producto</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal con Scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-28 space-y-6">
        {/* Métricas / KPIs de Cabecera con bg-[#09090b] */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#09090b] backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Depósito Central (Almacén 01)</span>
              <Layers className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white tracking-tight">4,812 un.</span>
              <p className="text-[11px] text-zinc-500 mt-0.5">En stock disponible</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#09090b] backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Sucursal 1 (Caja & Góndola)</span>
              <ShoppingBag className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white tracking-tight">1,240 un.</span>
              <p className="text-[11px] text-zinc-500 mt-0.5">Puntos de venta activos</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#09090b] backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Alertas de Reposición</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-amber-400 tracking-tight">3 SKUs</span>
              <p className="text-[11px] text-zinc-500 mt-0.5">Por debajo del punto de reorden</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BARRA DE HERRAMIENTAS: Búsqueda (Izquierda) + Ordenar por Precio (Derecha) */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Input de Búsqueda con Atajo */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por nombre, SKU, código de barras o categoría... (F2)"
              className="w-full h-9 pl-9 pr-14 text-xs bg-[#09090b] border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-xl transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/[0.08] rounded">
                  F2
                </kbd>
              )}
            </div>
          </div>

          {/* Botones de Ordenamiento por Precio */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-medium hidden md:inline-block">
              Ordenar por precio:
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-[#09090b] border border-white/[0.08] backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === "price_desc" ? "none" : "price_desc")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  sortOrder === "price_desc"
                    ? "bg-white/10 text-white border border-white/10 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
                title="Ordenar de mayor a menor precio"
              >
                <ArrowDown className="h-3.5 w-3.5 text-emerald-400" />
                <span>Mayor a Menor</span>
              </button>

              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === "price_asc" ? "none" : "price_asc")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  sortOrder === "price_asc"
                    ? "bg-white/10 text-white border border-white/10 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
                title="Ordenar de menor a mayor precio"
              >
                <ArrowUp className="h-3.5 w-3.5 text-blue-400" />
                <span>Menor a Mayor</span>
              </button>

              {sortOrder !== "none" && (
                <button
                  type="button"
                  onClick={() => setSortOrder("none")}
                  className="px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] rounded-md transition-colors cursor-pointer"
                  title="Restablecer orden"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABLA DE PRODUCTOS CON bg-[#09090b] & backdrop-blur-xl                    */}
        {/* ========================================================================= */}
        <div className="border border-white/[0.08] bg-[#09090b] backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
          {/* Header de la Card con Punto Indicador */}
          <div className="p-4 px-6 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <span className="text-sm font-semibold text-white tracking-tight">
                Catálogo de Productos
              </span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              Mostrando {paginatedProducts.length} de {filteredAndSortedProducts.length} productos
            </span>
          </div>

          {/* Tabla de Datos */}
          <div className="overflow-x-auto min-h-[320px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] font-medium text-zinc-500 bg-white/[0.01]">
                  <th className="py-3.5 pl-6 pr-4 font-semibold text-zinc-400">Nombre del Producto</th>
                  <th className="py-3.5 px-4 font-semibold text-zinc-400">Categoría</th>
                  <th className="py-3.5 px-4 font-semibold text-zinc-400">SKU</th>
                  <th className="py-3.5 px-4 font-semibold text-zinc-400">Precio</th>
                  <th className="py-3.5 px-4 font-semibold text-zinc-400">Fecha de Alta</th>
                  <th className="py-3.5 px-4 font-semibold text-zinc-400 text-center">Estado</th>
                  <th className="py-3.5 pl-4 pr-6 font-semibold text-zinc-400 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs">
                      No se encontraron productos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product: Product) => {
                    const isLowStock = product.stock <= product.minStockAlert;
                    const isActive = product.isActive;
                    const isMenuOpen = activeMenuProductId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        {/* 1. Columna: Nombre + Stock en paréntesis */}
                        <td className="py-3.5 pl-6 pr-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono mt-0.5">
                              ({product.stock} un.)
                            </span>
                          </div>
                        </td>

                        {/* 2. Columna: Categoría */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-zinc-400 font-medium">
                            {product.category?.name || "General"}
                          </span>
                        </td>

                        {/* 3. Columna: SKU exacto */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-mono text-zinc-300 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                            {product.sku}
                          </span>
                        </td>

                        {/* 4. Columna: Precio */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-bold text-white font-mono tracking-tight">
                            ${Number(product.price).toLocaleString("es-AR")}
                          </span>
                        </td>

                        {/* 5. Columna: Fecha de Alta */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-zinc-400 font-mono">
                            {formatDate(product.createdAt)}
                          </span>
                        </td>

                        {/* 6. Columna: Estado (Badges tipo Pill) */}
                        <td className="py-3.5 px-4 text-center">
                          {isActive ? (
                            isLowStock ? (
                              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Stock Bajo
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Publicado
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Inactivo
                            </span>
                          )}
                        </td>

                        {/* 7. Columna: Acción con Menú Desplegable Pequeño */}
                        <td className="py-3.5 pl-4 pr-6 text-right relative product-action-menu-container">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuProductId(isMenuOpen ? null : product.id);
                            }}
                            className={`h-7 w-7 inline-flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                              isMenuOpen
                                ? "bg-white/20 border-white/30 text-white shadow-md"
                                : "bg-[#09090b] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20"
                            }`}
                            title="Opciones del producto"
                            aria-expanded={isMenuOpen}
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>

                          {/* Menú Desplegable Flotante */}
                          {isMenuOpen && (
                            <div className="absolute right-14 top-6 z-20 w-44 rounded-xl bg-[#09090b] border border-white/[0.12] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 text-left">
                              <div className="px-2 py-1 text-[10px] font-mono text-zinc-500 border-b border-white/[0.08] mb-1 truncate">
                                {product.sku}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProductId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5 text-blue-400" />
                                <span>Editar Producto</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProductId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Ajustar Stock</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => copySkuToClipboard(product.sku)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                {copiedSku === product.sku ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                                )}
                                <span>
                                  {copiedSku === product.sku ? "Copiado!" : "Copiar SKU"}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProductId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Printer className="h-3.5 w-3.5 text-amber-400" />
                                <span>Imprimir Etiqueta</span>
                              </button>

                              <div className="h-px bg-white/[0.08] my-1" />

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuProductId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                <span>Eliminar / Desactivar</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* PAGINACIÓN ESTRUCTURAL CON bg-[#09090b]                                   */}
          {/* ========================================================================= */}
          <div className="p-4 px-6 border-t border-white/[0.08] bg-[#09090b]/60 flex items-center justify-between">
            {/* Lado Izquierdo: Botones Numéricos de Página */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 min-w-[32px] px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-white/10 text-white border border-white/20 shadow-sm font-semibold"
                        : "bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Lado Derecho: Flechas de Navegación Circular */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all ${
                  currentPage === 1
                    ? "border-white/[0.04] text-zinc-700 cursor-not-allowed bg-[#09090b]/40"
                    : "border-white/[0.08] bg-[#09090b] text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 cursor-pointer"
                }`}
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all ${
                  currentPage === totalPages
                    ? "border-white/[0.04] text-zinc-700 cursor-not-allowed bg-[#09090b]/40"
                    : "border-white/[0.08] bg-[#09090b] text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 cursor-pointer"
                }`}
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Producto */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
