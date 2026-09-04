"use client";

import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from "react";

export const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".odt",
  ".xls",
  ".xlsx",
  ".ods",
  ".csv",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
];

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.spreadsheet",
  "text/csv",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export interface UseAiDropzoneReturn {
  attachedFiles: File[];
  isDraggingOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  openFileDialog: () => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  handleFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dragProps: {
    onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
  };
}

/**
 * `useAiDropzone`
 * Hook resiliente de Drag & Drop para archivos externos.
 * Utiliza verificación geométrica de frontera (`relatedTarget`) y listeners globales de rescate
 * para evitar que la vista se quede congelada ante amagues continuos o cancelaciones del SO.
 */
export function useAiDropzone(): UseAiDropzoneReturn {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFileAllowed = (file: File) => {
    const name = file.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
    const hasValidMime = ACCEPTED_MIME_TYPES.includes(file.type) || file.type.startsWith("image/");
    return hasValidExt || hasValidMime;
  };

  const handleFilesProcess = (newFiles: FileList | File[]) => {
    const validFiles: File[] = [];

    Array.from(newFiles).forEach((file) => {
      if (!isFileAllowed(file)) {
        console.warn(`Formato no soportado para: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        console.warn(`El archivo ${file.name} supera el límite de 25MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // ─── MANEJADORES LOCALES DE ARRASTRE RESILIENTES ───
  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Verificamos si el cursor se movió hacia un elemento fuera de los límites del contenedor
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;

    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setIsDraggingOver(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesProcess(files);
    }
  };

  // ─── LISTENERS GLOBALES DE SEGURIDAD (ANTI-BLOQUEO) ───
  useEffect(() => {
    const handleGlobalCancel = () => {
      setIsDraggingOver(false);
    };

    // Reseteo si el puntero abandona por completo la ventana del navegador
    const handleWindowDragLeave = (e: globalThis.DragEvent) => {
      if (
        !e.relatedTarget &&
        (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)
      ) {
        setIsDraggingOver(false);
      }
    };

    window.addEventListener("dragend", handleGlobalCancel);
    window.addEventListener("drop", handleGlobalCancel);
    window.addEventListener("dragleave", handleWindowDragLeave);

    return () => {
      window.removeEventListener("dragend", handleGlobalCancel);
      window.removeEventListener("drop", handleGlobalCancel);
      window.removeEventListener("dragleave", handleWindowDragLeave);
    };
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesProcess(files);
    }
    e.target.value = "";
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setAttachedFiles([]);
  };

  return {
    attachedFiles,
    isDraggingOver,
    fileInputRef,
    openFileDialog,
    removeFile,
    clearFiles,
    handleFileInputChange,
    dragProps: {
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
    },
  };
}

