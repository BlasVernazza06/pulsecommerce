/**
 * Utilidades de carga asíncrona de PDF.js y formateo de archivos para previsualizaciones de IA.
 */

// Caché en memoria para no re-renderizar la misma primera página dos veces
export const pdfThumbnailCache = new Map<string, string>();

let pdfJsLoadingPromise: Promise<unknown> | null = null;

interface PdfJsGlobal {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (params: { data: ArrayBuffer }) => {
    promise: Promise<{
      getPage: (pageNum: number) => Promise<{
        getViewport: (params: { scale: number }) => { width: number; height: number };
        render: (params: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> };
      }>;
    }>;
  };
}

/**
 * Carga dinámica y resiliente de PDF.js (intenta ESM dinámico vía CDN y fallback a Script tag)
 */
export async function getPdfJsLib(): Promise<PdfJsGlobal | null> {
  if (typeof window === "undefined") return null;
  const win = window as unknown as { pdfjsLib?: PdfJsGlobal };
  if (win.pdfjsLib) return win.pdfjsLib;

  if (pdfJsLoadingPromise) return pdfJsLoadingPromise as Promise<PdfJsGlobal | null>;

  pdfJsLoadingPromise = (async () => {
    // 1. Intentamos ESM dinámico por CDN
    try {
      const cdnUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs";
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const dynamicImport = new Function("url", "return import(url)");
      const pdfjs = await dynamicImport(cdnUrl);
      if (pdfjs && (pdfjs.getDocument || pdfjs.default?.getDocument)) {
        const lib = (pdfjs.getDocument ? pdfjs : pdfjs.default) as PdfJsGlobal;
        lib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";
        win.pdfjsLib = lib;
        return lib;
      }
    } catch (esmErr) {
      console.warn("Fallo ESM import, activando fallback por script tag...", esmErr);
    }

    // 2. Fallback por inyección de script tag clásico
    return new Promise<PdfJsGlobal>((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="pdf.min.js"]');
      if (existingScript && win.pdfjsLib) {
        return resolve(win.pdfjsLib);
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        const lib = win.pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(lib);
        } else {
          reject(new Error("pdfjsLib no se inicializó correctamente"));
        }
      };
      script.onerror = () => reject(new Error("Error al descargar PDF.js desde CDN"));
      document.head.appendChild(script);
    });
  })();

  return pdfJsLoadingPromise as Promise<PdfJsGlobal | null>;
}

/**
 * Renderiza la primera página de un archivo PDF a DataURL webp
 */
export async function renderPdfFirstPageToDataUrl(file: File): Promise<string> {
  const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
  if (pdfThumbnailCache.has(cacheKey)) {
    return pdfThumbnailCache.get(cacheKey)!;
  }

  const pdfjsLib = await getPdfJsLib();
  if (!pdfjsLib) throw new Error("PDF.js no disponible");

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdfDoc.getPage(1);

  // Escala reducida para render ultrarrápido (~200px)
  const viewport = page.getViewport({ scale: 0.35 });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2D Context");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport }).promise;

  const dataUrl = canvas.toDataURL("image/webp", 0.85);
  pdfThumbnailCache.set(cacheKey, dataUrl);
  return dataUrl;
}

/**
 * Formatea tamaños de bytes en unidades legibles (KB, MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  if (bytes < k * k) {
    return `${Math.round(bytes / k)} KB`;
  }
  return `${(bytes / (k * k)).toFixed(2)} MB`;
}
