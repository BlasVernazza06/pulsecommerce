"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Loader2, FileText, Sparkles } from "lucide-react";
import { AiFileIcon } from "./ai-file-icon";

export interface AiFilePreviewCardProps {
  /** Archivo binario a inspeccionar */
  file: File;
}

// Caché en memoria para no re-renderizar la misma primera página dos veces
const pdfThumbnailCache = new Map<string, string>();

/**
 * `<AiFilePreviewCard />`
 * Tarjeta rica de previsualización (Rich Hover Preview) para archivos adjuntos en el chat de IA.
 * Implementa la Estrategia Híbrida de Rendimiento:
 * 1. Imágenes (PNG/JPG/WEBP): Miniatura instantánea por GPU con `URL.createObjectURL` y auto-cleanup.
 * 2. PDFs (Facturas/Remitos): Renderizado asíncrono de Página 1 a `<canvas>` ligero con lazy loading.
 * 3. Documentos Ofimáticos (DOCX/XLSX/CSV): Ficha técnica de inspección estructurada con 0ms de costo.
 */
export function AiFilePreviewCard({ file }: AiFilePreviewCardProps) {
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col gap-2 p-1 max-w-[260px] min-w-[210px] select-none pointer-events-auto">
      {/* ─── CASO 1: IMÁGENES NATIVAS ─── */}
      {isImage && <ImagePreviewThumbnail file={file} />}

      {/* ─── CASO 2: SCREENSHOT DE PÁGINA 1 DE PDF ─── */}
      {isPdf && <PdfFirstPageThumbnail file={file} />}

      {/* ─── CASO 3: FICHA DE INSPECCIÓN OFIMÁTICA (DOCX, XLSX, ETC.) ─── */}
      {!isImage && !isPdf && <OfficeDocInspectionSection file={file} />}

      {/* ─── METADATOS COMUNES Y ESTADO OCR ─── */}
      <div className="flex items-start gap-2 pt-1 border-t border-white/[0.06]">
        <div className="mt-0.5 shrink-0">
          <AiFileIcon file={file} className="h-4 w-4" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-xs font-semibold text-zinc-100 truncate leading-tight">
            {file.name}
          </p>
          <div className="flex items-center justify-between gap-1.5 mt-1">
            <span className="text-[10px] font-mono text-zinc-400">
              {formatBytes(file.size)}
            </span>
            <span className="px-1.5 py-0.2 text-[8px] font-semibold tracking-wider uppercase rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
              <Sparkles className="h-2 w-2" />
              OCR IA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUBCOMPONENTE: MINIATURA DE IMAGEN CON AUTO-CLEANUP ───
function ImagePreviewThumbnail({ file }: { file: File }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Creamos la URL apuntando al bloque de memoria en el navegador
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);

    // Limpieza obligatoria para evitar fugas de memoria (Memory Leaks)
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!imageUrl) return null;

  return (
    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-black/60 border border-white/[0.08] flex items-center justify-center group">
      <img
        src={imageUrl}
        alt={file.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300">
        Vista Previa
      </div>
    </div>
  );
}

// ─── CARGADOR RESILIENTE DE PDF.JS (ESM + SCRIPT TAG FALLBACK) ───
let pdfJsLoadingPromise: Promise<any> | null = null;

async function getPdfJsLib(): Promise<any> {
  if (typeof window === "undefined") return null;
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  if (pdfJsLoadingPromise) return pdfJsLoadingPromise;

  pdfJsLoadingPromise = (async () => {
    // 1. Intentamos ESM dinámico por CDN
    try {
      const cdnUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs";
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const dynamicImport = new Function("url", "return import(url)");
      const pdfjs = await dynamicImport(cdnUrl);
      if (pdfjs && (pdfjs.getDocument || pdfjs.default?.getDocument)) {
        const lib = pdfjs.getDocument ? pdfjs : pdfjs.default;
        lib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";
        (window as any).pdfjsLib = lib;
        return lib;
      }
    } catch (esmErr) {
      console.warn("Fallo ESM import, activando fallback por script tag...", esmErr);
    }

    // 2. Fallback por inyección de script tag clásico (Versión compatible universal)
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="pdf.min.js"]');
      if (existingScript && (window as any).pdfjsLib) {
        return resolve((window as any).pdfjsLib);
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(lib);
        } else {
          reject(new Error("pdfjsLib no se inicializó correctamente"));
        }
      };
      script.onerror = (e) => reject(new Error("Error al descargar PDF.js desde CDN"));
      document.head.appendChild(script);
    });
  })();

  return pdfJsLoadingPromise;
}

// ─── SUBCOMPONENTE: SCREENSHOT DE PÁGINA 1 DE PDF ───
function PdfFirstPageThumbnail({ file }: { file: File }) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;

    // Verificamos si ya existe en la caché en memoria
    if (pdfThumbnailCache.has(cacheKey)) {
      setThumbnailSrc(pdfThumbnailCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasError(false);

    // Pipeline dinámico de renderizado a canvas
    const renderPdfFirstPage = async () => {
      try {
        const pdfjsLib = await getPdfJsLib();
        if (!pdfjsLib) throw new Error("PDF.js no disponible");

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdfDoc.getPage(1);

        // Escala reducida para render ultrarrápido y ligero (~200px)
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("No 2D Context");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL("image/webp", 0.85);
        pdfThumbnailCache.set(cacheKey, dataUrl);

        if (isMounted) {
          setThumbnailSrc(dataUrl);
          setLoading(false);
        }
      } catch (err) {
        console.warn("No se pudo renderizar la primera página del PDF:", err);
        if (isMounted) {
          setHasError(true);
          setLoading(false);
        }
      }
    };

    renderPdfFirstPage();

    return () => {
      isMounted = false;
    };
  }, [file]);

  if (loading) {
    return (
      <div className="w-full h-32 rounded-lg bg-zinc-950/80 border border-white/[0.08] flex flex-col items-center justify-center gap-1.5 text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        <span className="text-[10px] font-mono">Renderizando Pág. 1...</span>
      </div>
    );
  }

  if (hasError || !thumbnailSrc) {
    return (
      <div className="w-full h-24 rounded-lg bg-zinc-950/80 border border-white/[0.08] flex flex-col items-center justify-center text-zinc-400 gap-1 p-2 text-center">
        <FileText className="h-5 w-5 text-red-400" />
        <span className="text-[11px] font-medium text-zinc-200">Documento PDF</span>
        <span className="text-[9px] text-zinc-500 font-mono">Listo para extracción OCR</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-h-40 rounded-lg overflow-hidden bg-black/70 border border-white/[0.08] flex items-center justify-center group">
      <img
        src={thumbnailSrc}
        alt={`Primera página de ${file.name}`}
        className="w-full h-auto max-h-40 object-contain bg-white/[0.02]"
      />
      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300">
        Pág. 1
      </div>
    </div>
  );
}

// ─── SUBCOMPONENTE: FICHA OFIMÁTICA (DOCX, XLSX, CSV) ───
function OfficeDocInspectionSection({ file }: { file: File }) {
  const extension = file.name.split(".").pop()?.toUpperCase() || "DOC";

  const lastModifiedFormatted = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(file.lastModified));

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-white/[0.02] border border-white/[0.06] rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-zinc-300">
          Documento {extension}
        </span>
        <span className="text-[9px] text-zinc-500 font-mono">
          {lastModifiedFormatted}
        </span>
      </div>
      <p className="text-[10px] text-zinc-400 leading-tight">
        Se extraerá el texto, tablas y celdas para el contexto de la IA.
      </p>
    </div>
  );
}

// ─── UTILIDAD: FORMATEO DE BYTES ───
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  if (bytes < k * k) {
    return `${Math.round(bytes / k)} KB`;
  }
  return `${(bytes / (k * k)).toFixed(2)} MB`;
}
