import { FileText, X } from 'lucide-react';

interface FilePreviewProps {
  fileName: string;
  onRemove: () => void;
}

export function FilePreview({ fileName, onRemove }: FilePreviewProps) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <div className="flex items-center gap-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
        <FileText size={14} />
        <span className="max-w-50 truncate">{fileName}</span>
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full p-0.5 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}