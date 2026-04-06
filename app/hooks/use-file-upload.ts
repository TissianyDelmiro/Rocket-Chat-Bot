import { useState } from 'react';
import { ALLOWED_FILE_TYPES, ALLOWED_FILE_EXTENSIONS } from '@/app/lib/constants';

export function useFileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      alert('Formato não suportado. Apenas PDF, XLSX e CSV são permitidos.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    e.target.value = '';
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const fileToFileUIPart = async (file: File) => {
    return new Promise<{ type: 'file'; mediaType: string; filename: string; url: string }>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          type: 'file',
          mediaType: file.type || 'application/octet-stream',
          filename: file.name,
          url: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return { selectedFile, handleFileSelect, removeFile, fileToFileUIPart };
}