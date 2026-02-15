"use client";

import { CheckCircle, XCircle, X } from "lucide-react";

type Variant = "success" | "error";

interface AckModalProps {
  open: boolean;
  onClose: () => void;
  variant: Variant;
  title: string;
  message: string;
  buttonLabel?: string;
}

export default function AckModal({
  open,
  onClose,
  variant,
  title,
  message,
  buttonLabel = "Chiudi",
}: AckModalProps) {
  if (!open) return null;

  const isSuccess = variant === "success";
  const Icon = isSuccess ? CheckCircle : XCircle;
  const iconBg = isSuccess ? "bg-green-500/20" : "bg-red-500/20";
  const iconColor = isSuccess ? "text-green-400" : "text-red-400";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ack-modal-title"
    >
      <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center`}>
              <Icon size={24} className={iconColor} />
            </div>
            <h2
              id="ack-modal-title"
              className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-muted mb-6 whitespace-pre-line">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`w-full px-6 py-3 font-bold rounded-full transition-colors ${
            isSuccess
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
