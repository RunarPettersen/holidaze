import React from "react";

type Props = {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  loading,
}: Props) {
  if (!open) return null;

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className="w-full max-w-md rounded-xl border border-ink/20 bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {message && <div className="text-sm text-gray-700 mb-4">{message}</div>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded border border-ink/20 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="bg-brand-900 hover:bg-brand-800 text-white rounded px-3 py-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={loading}
            autoFocus
          >
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}