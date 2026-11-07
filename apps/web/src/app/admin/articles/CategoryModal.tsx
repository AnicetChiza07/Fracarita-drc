'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoryCreated: (category: { id: string; name: string }) => void;
}

export default function CategoryModal({ isOpen, onClose, onCategoryCreated }: CategoryModalProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Le nom de la catégorie est obligatoire');
            return;
        }

        setIsSubmitting(true);
        try {
            // Appel à la VRAIE API pour créer la catégorie en base de données
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création');
            }

            // On affiche le toast AVANT de fermer
            toast.success('Catégorie créée avec succès');
            
            // On passe la VRAIE catégorie (avec son vrai ID de la DB) au parent
            setTimeout(() => {
                onCategoryCreated(data.category);
                setName('');
                onClose();
            }, 400);

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-dark">Nouvelle catégorie</h3>
                    <button onClick={onClose} className="p-2 hover:bg-cream rounded-lg">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-dark uppercase mb-1 block">Nom de la catégorie</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Éducation, Santé, Eau..."
                            className="w-full px-4 py-2 bg-cream border border-gray-200 rounded-lg outline-none focus:border-lime transition-colors"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream transition-colors">Annuler</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}