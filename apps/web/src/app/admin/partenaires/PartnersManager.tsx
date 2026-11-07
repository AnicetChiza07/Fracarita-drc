'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Handshake, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';

type Partner = {
    id: string;
    logoUrl: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
};

interface PartnersManagerProps {
    initialPartners: Partner[];
}

export default function PartnersManager({ initialPartners }: PartnersManagerProps) {
    const [partners, setPartners] = useState<Partner[]>(initialPartners);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);

    const [formData, setFormData] = useState({
        logoUrl: undefined as string | undefined,
        order: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openFormModal = (partner: Partner | null = null) => {
        setEditingPartner(partner);
        if (partner) {
            setFormData({
                logoUrl: partner.logoUrl || undefined,
                order: partner.order,
            });
        } else {
            setFormData({
                logoUrl: undefined,
                order: partners.length,
            });
        }
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.logoUrl) {
            toast.error('Le logo est obligatoire');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                logoUrl: formData.logoUrl,
                order: formData.order,
            };

            if (editingPartner) {
                const response = await fetch(`/api/partenaires/${editingPartner.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la modification');

                setPartners(partners.map(p => p.id === editingPartner.id ? data.partner : p).sort((a, b) => a.order - b.order));
                toast.success('Partenaire modifié avec succès');
            } else {
                const response = await fetch('/api/partenaires', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

                setPartners([...partners, data.partner].sort((a, b) => a.order - b.order));
                toast.success('Partenaire ajouté avec succès');
            }

            setIsFormModalOpen(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingPartner) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/partenaires/${deletingPartner.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');

            setPartners(partners.filter(p => p.id !== deletingPartner.id));
            toast.success('Partenaire supprimé avec succès');
            setIsDeleteModalOpen(false);
            setDeletingPartner(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const moveLeft = async (partner: Partner, index: number) => {
        if (index === 0) return;
        const newOrder = partner.order - 1;
        try {
            const response = await fetch(`/api/partenaires/${partner.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logoUrl: partner.logoUrl, order: newOrder }),
            });
            if (response.ok) {
                setPartners(partners.map(p => p.id === partner.id ? { ...p, order: newOrder } : p).sort((a, b) => a.order - b.order));
                toast.success('Ordre mis à jour');
            }
        } catch (error) {
            toast.error('Erreur lors du déplacement');
        }
    };

    const moveRight = async (partner: Partner, index: number) => {
        if (index === partners.length - 1) return;
        const newOrder = partner.order + 1;
        try {
            const response = await fetch(`/api/partenaires/${partner.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logoUrl: partner.logoUrl, order: newOrder }),
            });
            if (response.ok) {
                setPartners(partners.map(p => p.id === partner.id ? { ...p, order: newOrder } : p).sort((a, b) => a.order - b.order));
                toast.success('Ordre mis à jour');
            }
        } catch (error) {
            toast.error('Erreur lors du déplacement');
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-dark">Partenaires</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">
                            {partners.length} partenaire{partners.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-text-light">{`Gérez les logos des partenaires et leur ordre d'affichage.`}</p>
                </div>
                <button
                    onClick={() => openFormModal()}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors"
                >
                    <Plus size={18} /> Ajouter un partenaire
                </button>
            </div>

            {/* Grille de cartes des partenaires (4 par ligne sur ordinateur) */}
            {partners.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Handshake size={48} className="mx-auto text-text-light/30 mb-4" />
                    <p className="text-text-light font-medium">Aucun partenaire pour le moment</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {partners.map((partner, index) => (
                        <div 
                            key={partner.id} 
                            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-lime/30 transition-all duration-300 flex flex-col"
                        >
                            {/* Badge d'ordre */}
                            <div className="absolute top-2 left-2 z-10 bg-dark/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                Position : {partner.order + 1}
                            </div>

                            {/* Zone du logo */}
                            <div className="h-32 w-full bg-white flex items-center justify-center p-4 border-b border-gray-100">
                                {partner.logoUrl ? (
                                    <img 
                                        src={partner.logoUrl} 
                                        alt="Logo partenaire" 
                                        className="max-h-full max-w-full object-contain drop-shadow-sm" 
                                    />
                                ) : (
                                    <ImageIcon size={32} className="text-text-light/30" />
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-3 flex items-center justify-between bg-cream/30 mt-auto border-t border-gray-100">
                                {/* Flèches d'ordre horizontales */}
                                <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                                    <button
                                        onClick={() => moveLeft(partner, index)}
                                        disabled={index === 0}
                                        className="p-1.5 text-text-light hover:text-dark hover:bg-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        title="Déplacer vers la gauche"
                                    >
                                        <ArrowLeft size={14} />
                                    </button>
                                    <button
                                        onClick={() => moveRight(partner, index)}
                                        disabled={index === partners.length - 1}
                                        className="p-1.5 text-text-light hover:text-dark hover:bg-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        title="Déplacer vers la droite"
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                </div>

                                {/* Boutons Modifier / Supprimer */}
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => openFormModal(partner)} 
                                        className="p-1.5 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                                        title="Modifier"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => { setDeletingPartner(partner); setIsDeleteModalOpen(true); }} 
                                        className="p-1.5 text-text-light hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL : Formulaire Partenaire */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-dark">{editingPartner ? 'Modifier le partenaire' : 'Nouveau partenaire'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <ImageUploader
                                value={formData.logoUrl}
                                onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                                label="Logo du partenaire *"
                            />

                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">{`Ordre d'affichage`}</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                />
                                <p className="text-xs text-text-light mt-1">Les partenaires sont affichés du plus petit au plus grand ordre.</p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                                >
                                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                    {editingPartner ? 'Mettre à jour' : 'Ajouter le partenaire'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL : Confirmation de suppression */}
            {isDeleteModalOpen && deletingPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer ce partenaire ?</h3>
                        <p className="text-sm text-text-light mb-6">Cette action est irréversible.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream transition-colors">Annuler</button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                                {isSubmitting && <Loader2 size={16} className="animate-spin" />} Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}