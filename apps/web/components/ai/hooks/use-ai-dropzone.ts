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
  const isDraggingOverRef = useRef(false);

  // Mantenemos sincronizado el ref para callbacks y listeners asíncronos
  useEffect(() => {
    isDraggingOverRef.current = isDraggingOver;
  }, [isDraggingOver]);

  // Listener de rescate global para mouseup y blur de ventana
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      if (isDraggingOverRef.current) {
        setIsDraggingOver(false);
      }
    };

    window.addEventListener("mouseup", handleGlobalDragEnd);
    window.addEventListener("blur", handleGlobalDragEnd);
    window.addEventListener("dragleave", (e) => {
      // Si sale completamente de la ventana del navegador
      if (!e.relatedTarget || (e.clientX <= 0 && e.clientY <= 0)) {
        setIsDraggingOver(false);
      }
    });

    return () => {
      window.removeEventListener("mouseup", handleGlobalDragEnd);
      window.removeEventListener("blur", handleGlobalDragEnd);
    };
  }, []);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const addFiles = (filesToAdd: File[]) => {
    const validFiles = filesToAdd.filter((file) => {
      // Validamos tamaño máximo
      if (file.size > MAX_FILE_SIZE_BYTES) {
        console.warn(`El archivo "${file.name}" supera el límite de 25MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setAttachedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearFiles = () => {
    setAttachedFiles([]);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      addFiles(selected);
    }
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.types && e.dataTransfer.types.includes("Files")) {
      setIsDraggingOver(true);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Solo apagamos el estado si el puntero abandonó el elemento contenedor (no sus hijos)
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!currentTarget.contains(relatedTarget)) {
      setIsDraggingOver(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
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
