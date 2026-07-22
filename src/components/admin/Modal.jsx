import React from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  size = "md",
  showFooter = true,
  onConfirm,
  confirmText = "Guardar",
  cancelText = "Cancelar",
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className={`bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow-xl ${sizeClasses[size]} w-11/12 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#1e1e1e]">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">{children}</div>

        {showFooter && (
          <div className="flex gap-3 justify-end p-6 border-t border-[#1e1e1e]">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-[#1e1e1e] hover:bg-[#2a2a2a] rounded-lg transition-colors duration-200"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-[#d4af37] hover:bg-[#d4af37]/90 text-[#0a0f1a] font-bold rounded-lg transition-colors duration-200"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
