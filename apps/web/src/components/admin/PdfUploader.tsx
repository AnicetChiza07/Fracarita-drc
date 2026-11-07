'use client';

import { useState, useRef } from 'react';
import { X, Loader2, FileText, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadThing } from '@/lib/uploadthing';

interface PdfUploaderProps {
    value?: string;
    name?: string;
    onChange: (url?: string, name?: string, size?: string) => void;
    label: string;
}

export default function PdfUploader({ value, name, onChange, label }: PdfUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastIdRef = useRef<string | number | null>(null);

    const { startUpload, isUploading } = useUploadThing("pdfUploader", {
        onUploadBegin: () => {
            toastIdRef.current = toast.loading('Upload du PDF en cours...');
        },
        onClientUploadComplete: (res) => {
            if (res && res[0]) {
                const sizeInMB = (res[0].size / (1024 * 1024)).toFixed(2);
                const fileName = res[0].name || 'document.pdf';
                
                onChange(res[0].url, fileName, `${sizeInMB} Mo`);
                
                if (toastIdRef.current) {
                    toast.success('PDF uploadé avec succès', { id: toastIdRef.current });
                } else {
                    toast.success('PDF uploadé avec succès');
                }
            }
        },
        onUploadError: (error) => {
            if (toastIdRef.current) {
                toast.error(`Erreur: ${error.message}`, { id: toastIdRef.current });
            } else {
                toast.error(`Erreur: ${error.message}`);
            }
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Veuillez sélectionner un fichier PDF');
                return;
            }
            startUpload([file]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (value) {
        return (
            <div className="space-y-2">
                <label className="text-xs font-semibold text-dark uppercase tracking-wider">{label}</label>
                <div className="relative flex items-center gap-3 p-4 bg-cream border border-gray-200 rounded-xl group">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark truncate">{name || 'document.pdf'}</p>
                        <p className="text-xs text-text-light">PDF uploadé</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange(undefined, undefined, undefined)}
                        className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-200"
                        title="Supprimer le PDF"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-dark uppercase tracking-wider">{label}</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-cream/50 hover:bg-cream hover:border-lime/50 transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    {isUploading ? (
                        <Loader2 size={28} className="text-lime-dark animate-spin mb-2" />
                    ) : (
                        <UploadCloud size={28} className="text-text-light/50 mb-2 group-hover:text-lime-dark transition-colors" />
                    )}
                    <p className="text-sm text-text-light">
                        <span className="font-semibold text-dark">Cliquez pour uploader</span>
                    </p>
                    <p className="text-xs text-text-light/60">PDF uniquement (MAX. 16MB)</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
}