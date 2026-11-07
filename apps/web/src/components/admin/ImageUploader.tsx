'use client';

import { useState, useRef } from 'react';
import { X, Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadThing } from '@/lib/uploadthing';

interface ImageUploaderProps {
    value?: string;
    onChange: (url?: string) => void;
    label: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastIdRef = useRef<string | number | null>(null); // Pour stocker l'ID du toast

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onUploadBegin: () => {
            // On crée le toast et on stocke son ID
            toastIdRef.current = toast.loading('Upload en cours, veuillez patienter...');
        },
        onClientUploadComplete: (res) => {
            if (res && res[0]) {
                onChange(res[0].url);
                // On utilise le même ID pour remplacer le toast de chargement
                if (toastIdRef.current) {
                    toast.success('Image de couverture uploadée avec succès', { id: toastIdRef.current });
                } else {
                    toast.success('Image de couverture uploadée avec succès');
                }
            }
        },
        onUploadError: (error) => {
            if (toastIdRef.current) {
                toast.error(`Erreur d'upload: ${error.message}`, { id: toastIdRef.current });
            } else {
                toast.error(`Erreur d'upload: ${error.message}`);
            }
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
                <div className="relative w-full h-48 rounded-xl border border-gray-200 overflow-hidden bg-cream group">
                    <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                    <button
                        type="button"
                        onClick={() => onChange(undefined)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 z-10"
                        title="Supprimer l'image"
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
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-cream/50 hover:bg-cream hover:border-lime/50 transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                        <Loader2 size={32} className="text-lime-dark animate-spin mb-3" />
                    ) : (
                        <UploadCloud size={32} className="text-text-light/50 mb-3 group-hover:text-lime-dark transition-colors" />
                    )}
                    <p className="mb-2 text-sm text-text-light">
                        <span className="font-semibold text-dark">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-text-light/60">PNG, JPG ou WEBP (MAX. 4MB)</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
}