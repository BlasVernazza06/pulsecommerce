"use client";

import {
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  File,
} from "lucide-react";

export type FileTypeCategory =
  | "pdf"
  | "docx"
  | "odt"
  | "xlsx"
  | "image"
  | "archive"
  | "code"
  | "generic";

/**
 * Obtiene la categoría del archivo analizando su extensión o MIME type
 */
export function getFileTypeCategory(file: File | { name: string; type?: string }): FileTypeCategory {
  const name = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  // 1. PDF
  if (name.endsWith(".pdf") || mime === "application/pdf") {
    return "pdf";
  }

  // 2. DOCX / DOC (Microsoft Word)
  if (
    name.endsWith(".docx") ||
    name.endsWith(".doc") ||
    mime.includes("wordprocessingml") ||
    mime.includes("msword")
  ) {
    return "docx";
  }

  // 3. ODT (OpenDocument Text)
  if (
    name.endsWith(".odt") ||
    mime === "application/vnd.oasis.opendocument.text"
  ) {
    return "odt";
  }

  // 4. Spreadsheets (XLSX, XLS, CSV, ODS)
  if (
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    name.endsWith(".csv") ||
    name.endsWith(".ods") ||
    mime.includes("spreadsheetml") ||
    mime.includes("excel") ||
    mime.includes("csv") ||
    mime === "application/vnd.oasis.opendocument.spreadsheet"
  ) {
    return "xlsx";
  }

  // 5. Imágenes
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp") ||
    name.endsWith(".gif") ||
    name.endsWith(".svg") ||
    mime.startsWith("image/")
  ) {
    return "image";
  }

  // 6. Archivos comprimidos
  if (
    name.endsWith(".zip") ||
    name.endsWith(".rar") ||
    name.endsWith(".7z") ||
    name.endsWith(".tar") ||
    name.endsWith(".gz")
  ) {
    return "archive";
  }

  // 7. Código / JSON
  if (
    name.endsWith(".json") ||
    name.endsWith(".ts") ||
    name.endsWith(".js") ||
    name.endsWith(".sql")
  ) {
    return "code";
  }

  return "generic";
}

export interface AiFileIconProps {
  file: File | { name: string; type?: string };
  className?: string;
}

/**
 * `<AiFileIcon />`
 * Renderiza un ícono vectorial nítido con color distintivo de marca para cada formato:
 * - PDF: Rojo Adobe (`#EF4444`) con pliegue de página y micro-badge.
 * - DOCX: Azul Microsoft Word (`#2563EB`) con pliegue y badge DOC.
 * - ODT: Cian/Índigo OpenDocument (`#0EA5E9`) con pliegue y badge ODT.
 * - XLSX / CSV: Verde Excel (`#10B981`).
 * - Imágenes: Violeta (`#8B5CF6`).
 */
export function AiFileIcon({ file, className = "h-3.5 w-3.5" }: AiFileIconProps) {
  const category = getFileTypeCategory(file);

  switch (category) {
    case "pdf":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-full w-full drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
              className="fill-red-500/20 stroke-red-500"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6"
              className="stroke-red-400"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="11"
              y="17"
              fontSize="6.5"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
              textAnchor="middle"
              className="fill-red-300 font-black tracking-tighter"
            >
              PDF
            </text>
          </svg>
        </div>
      );

    case "docx":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-full w-full drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
              className="fill-blue-500/20 stroke-blue-500"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6"
              className="stroke-blue-400"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="11"
              y="17"
              fontSize="6"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
              textAnchor="middle"
              className="fill-blue-300 font-black tracking-tighter"
            >
              DOC
            </text>
          </svg>
        </div>
      );

    case "odt":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-full w-full drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
              className="fill-sky-500/20 stroke-sky-400"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6"
              className="stroke-sky-300"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="11"
              y="17"
              fontSize="6"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
              textAnchor="middle"
              className="fill-sky-200 font-black tracking-tighter"
            >
              ODT
            </text>
          </svg>
        </div>
      );

    case "xlsx":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <FileSpreadsheet className="h-full w-full text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
        </div>
      );

    case "image":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <ImageIcon className="h-full w-full text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
        </div>
      );

    case "archive":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <FileArchive className="h-full w-full text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
        </div>
      );

    case "code":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <FileCode className="h-full w-full text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <File className="h-full w-full text-zinc-400" />
        </div>
      );
  }
}
