"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ToastContextType {
  toast: (options: {
    type?: ToastType;
    title?: string;
    message: string;
    duration?: number;
  }) => void;
  toastSuccess: (message: string, title?: string) => void;
  toastError: (message: string, title?: string) => void;
  toastInfo: (message: string, title?: string) => void;
  toastWarning: (message: string, title?: string) => void;
  confirm: (options: ConfirmDialogOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      type = "success",
      title,
      message,
      duration = 4000,
    }: {
      type?: ToastType;
      title?: string;
      message: string;
      duration?: number;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newItem: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newItem]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toastSuccess = useCallback(
    (message: string, title: string = "Thành công!") => {
      toast({ type: "success", title, message });
    },
    [toast]
  );

  const toastError = useCallback(
    (message: string, title: string = "Có lỗi xảy ra!") => {
      toast({ type: "error", title, message });
    },
    [toast]
  );

  const toastInfo = useCallback(
    (message: string, title: string = "Thông báo") => {
      toast({ type: "info", title, message });
    },
    [toast]
  );

  const toastWarning = useCallback(
    (message: string, title: string = "Cảnh báo") => {
      toast({ type: "warning", title, message });
    },
    [toast]
  );

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const handleConfirmAction = () => {
    if (confirmDialog) {
      confirmDialog.onConfirm();
      setConfirmDialog(null);
    }
  };

  const handleCancelAction = () => {
    if (confirmDialog) {
      if (confirmDialog.onCancel) confirmDialog.onCancel();
      setConfirmDialog(null);
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        toastSuccess,
        toastError,
        toastInfo,
        toastWarning,
        confirm,
      }}
    >
      {children}

      {/* FLOATING TOASTS CONTAINER */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-3">
        {toasts.map((t) => {
          const typeConfig = {
            success: {
              border: "border-emerald-500/50 bg-[#071714]/95 text-emerald-300",
              glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]",
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
              accent: "text-emerald-400",
            },
            error: {
              border: "border-rose-500/50 bg-[#1a080c]/95 text-rose-300",
              glow: "shadow-[0_0_25px_rgba(244,63,94,0.25)]",
              icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
              accent: "text-rose-400",
            },
            warning: {
              border: "border-amber-500/50 bg-[#1a1205]/95 text-amber-300",
              glow: "shadow-[0_0_25px_rgba(245,158,11,0.25)]",
              icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
              accent: "text-amber-400",
            },
            info: {
              border: "border-[#ffd700]/50 bg-[#0d1726]/95 text-gray-200",
              glow: "shadow-[0_0_25px_rgba(255,215,0,0.25)]",
              icon: <Sparkles className="w-5 h-5 text-[#ffd700] shrink-0" />,
              accent: "text-[#ffd700]",
            },
          }[t.type];

          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-2xl border ${typeConfig.border} ${typeConfig.glow} p-4 backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-top-4`}
            >
              <div className="mt-0.5">{typeConfig.icon}</div>
              <div className="flex-1 min-w-0">
                {t.title && (
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${typeConfig.accent} mb-0.5`}>
                    {t.title}
                  </h4>
                )}
                <p className="text-xs sm:text-[13px] leading-relaxed text-gray-100 font-medium">
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0c1626] border-2 border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmDialog.type === "danger"
                    ? "bg-rose-500/15 border border-rose-500/40 text-rose-400"
                    : "bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd700]"
                }`}
              >
                {confirmDialog.type === "danger" ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-white">
                {confirmDialog.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-13">
              {confirmDialog.message}
            </p>

            <div className="pt-3 border-t border-[#1e2e45] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCancelAction}
                className="px-4 py-2 bg-[#142339] hover:bg-[#1d3353] text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
              >
                {confirmDialog.cancelText || "Hủy Bỏ"}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 text-xs font-bold rounded-xl shadow-lg transition-all ${
                  confirmDialog.type === "danger"
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-gradient-to-r from-[#d4af37] to-[#e5b869] text-black hover:brightness-110"
                }`}
              >
                {confirmDialog.confirmText || "Xác Nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: ({ message }: { message: string }) => console.log(message),
      toastSuccess: (msg: string) => console.log(msg),
      toastError: (msg: string) => console.error(msg),
      toastInfo: (msg: string) => console.info(msg),
      toastWarning: (msg: string) => console.warn(msg),
      confirm: (opts: ConfirmDialogOptions) => {
        if (window.confirm(opts.message)) opts.onConfirm();
      },
    };
  }
  return context;
}
