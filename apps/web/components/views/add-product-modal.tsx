"use client";

import * as React from "react";
import { X, Sparkles, Barcode, Check, AlertCircle, PackagePlus, DollarSign, Layers } from "lucide-react";
import { Button, Badge } from "@pulsecommerce/ui";
import { MOCK_CATEGORIES, type Product, type Category } from "@pulsecommerce/contracts";

export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => void;
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [name, setName] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>(MOCK_CATEGORIES[0]?.id || "");
  const [price, setPrice] = React.useState<string>("");
  const [costPrice, setCostPrice] = React.useState<string>("");
  const [stock, setStock] = React.useState<string>("10");
  const [minStockAlert, setMinStockAlert] = React.useState<string>("5");
  const [unit, setUnit] = React.useState<"UNIT" | "KG" | "LITER" | "METER">("UNIT");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const nameInputRef = React.useRef<HTMLInputElement>(null);

  // Autoenfocar primer input al abrir
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
      // Reset de formulario con valores limpios
      setName("");
      setSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
      setBarcode(`779${Math.floor(1000000000 + Math.random() * 9000000000)}`);
      setCategoryId(MOCK_CATEGORIES[0]?.id || "");
      setPrice("");
      setCostPrice("");
      setStock("10");
      setMinStockAlert("5");
      setUnit("UNIT");
      setErrors({});
    }
  }, [isOpen]);

  // Cerrar con Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generar SKU aleatorio
  const handleGenerateSku = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setSku(`SKU-${randomCode}`);
    setErrors((prev) => ({ ...prev, sku: "" }));
  };

  // Generar Barcode aleatorio
  const handleGenerateBarcode = () => {
    const randomEan = `779${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setBarcode(randomEan);
    setErrors((prev) => ({ ...prev, barcode: "" }));
  };

  // Cálculo de margen de ganancia en vivo
  const numPrice = parseFloat(price) || 0;
  const numCost = parseFloat(costPrice) || 0;
  const marginPercent = numCost > 0 && numPrice > numCost 
    ? (((numPrice - numCost) / numPrice) * 100).toFixed(1)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "El nombre del producto es obligatorio";
    if (!sku.trim()) newErrors.sku = "El SKU es obligatorio";
    if (!barcode.trim()) newErrors.barcode = "El código de barras es obligatorio";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Ingrese un precio de venta mayor a 0";
    if (costPrice && parseFloat(costPrice) < 0) newErrors.costPrice = "El costo no puede ser negativo";
    if (!stock || parseInt(stock, 10) < 0) newErrors.stock = "El stock debe ser 0 o mayor";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCat = MOCK_CATEGORIES.find((c) => c.id === categoryId) || null;

    const newProduct: Product = {
      id: crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      description: null,
      primaryBarcode: barcode.trim(),
      barcodes: [],
      price: parseFloat(price),
      costPrice: costPrice ? parseFloat(costPrice) : 0,
      taxRate: 0.21,
      stock: parseInt(stock, 10) || 0,
      minStockAlert: parseInt(minStockAlert, 10) || 5,
      allowFractionalQty: unit !== "UNIT",
      unit: unit,
      categoryId: categoryId || null,
      category: selectedCat,
      imageUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-xl bg-[#09090b] border border-white/[0.12] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        {/* Cabecera del Modal */}
        <div className="h-16 px-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <PackagePlus className="h-4 w-4" />
            </div>
            <div>
              <h3 id="add-product-title" className="text-sm font-semibold text-white tracking-tight">
                Agregar Nuevo Producto
              </h3>
              <p className="text-[11px] text-zinc-400">
                Alta de SKU en el catálogo e inventario local
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] text-zinc-400 border-white/[0.08]">
              Local-First
            </Badge>
            <button
              type="button"
              onClick={onClose}
              className="h-7 w-7 rounded-lg inline-flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh] no-scrollbar">
          {/* 1. Nombre del Producto */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Nombre del Producto <span className="text-rose-400">*</span></span>
              {errors.name && <span className="text-[11px] text-rose-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.name}</span>}
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Ej: Coca-Cola 500ml Zero"
              className={`w-full h-9 px-3 text-xs bg-black/60 border ${
                errors.name ? "border-rose-500/50 focus:border-rose-500" : "border-white/[0.08] focus:border-blue-500"
              } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
            />
          </div>

          {/* 2. SKU y Código de Barras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>SKU / Identificador <span className="text-rose-400">*</span></span>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <Sparkles className="h-2.5 w-2.5" /> Auto
                </button>
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  if (errors.sku) setErrors((prev) => ({ ...prev, sku: "" }));
                }}
                placeholder="SKU-100234"
                className="w-full h-9 px-3 text-xs font-mono bg-black/60 border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Código de Barras */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Código de Barras (EAN) <span className="text-rose-400">*</span></span>
                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <Barcode className="h-3 w-3" /> Gen EAN
                </button>
              </label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  if (errors.barcode) setErrors((prev) => ({ ...prev, barcode: "" }));
                }}
                placeholder="7791234567890"
                className="w-full h-9 px-3 text-xs font-mono bg-black/60 border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* 3. Categoría y Unidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-black/60 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {MOCK_CATEGORIES.map((cat: Category) => (
                  <option key={cat.id} value={cat.id} className="bg-[#09090b] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Unidad de Medida
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as "UNIT" | "KG" | "LITER" | "METER")}
                className="w-full h-9 px-3 text-xs bg-black/60 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="UNIT" className="bg-[#09090b] text-white">Unidad (Un)</option>
                <option value="KG" className="bg-[#09090b] text-white">Kilogramo (Kg)</option>
                <option value="LITER" className="bg-[#09090b] text-white">Litro (L)</option>
                <option value="METER" className="bg-[#09090b] text-white">Metro (m)</option>
              </select>
            </div>
          </div>

          {/* 4. Precios & Margen Estimado */}
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-black/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                Precios & Rentabilidad
              </span>
              {marginPercent && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Margen: +{marginPercent}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">
                  Precio de Venta ($) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                  }}
                  placeholder="0.00"
                  className={`w-full h-9 px-3 text-xs font-mono bg-black/60 border ${
                    errors.price ? "border-rose-500/50" : "border-white/[0.08]"
                  } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">
                  Costo de Reposición ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-9 px-3 text-xs font-mono bg-black/60 border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* 5. Control de Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Stock Inicial
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-9 px-3 text-xs font-mono bg-black/60 border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Alerta de Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value)}
                className="w-full h-9 px-3 text-xs font-mono bg-black/60 border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-4 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
            >
              Cancelar (Esc)
            </button>
            <Button
              type="submit"
              className="h-8 px-4 text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm gap-1.5"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Guardar Producto</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
