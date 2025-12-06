"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg";
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  width = "md",
}: ModalProps) {
  if (!open) return null;

  const widthClass =
    width === "sm"
      ? "max-w-sm"
      : width === "lg"
      ? "max-w-2xl"
      : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 md:px-0">
      <div
        className={`w-full ${widthClass} bg-[#111] border border-gray-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div>{children}</div>

        {/* FOOTER */}
        {footer && (
          <div className="flex justify-end gap-3 mt-6 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
