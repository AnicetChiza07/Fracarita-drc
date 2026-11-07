'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Trophy, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';

type Realisation = {
    id: string;
    title: string;
    description: string | null;
    location: string;
    eventDate: Date;
    imageUrl: string | null;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    category: { id: string; name: string } | null;
};

type Category = {
    id: string;
    name: string;
};

interface RealisationsManagerProps {
    initialRealisations: Realisation[];
    initialCategories: Category[];
}

export default function RealisationsManager({ initialRealisations, initialCategories }: RealisationsManagerProps) {
    const [realisations, setRealisations] = useState<Realisation[]>(initialRealisations);
    const [categories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRealisation, setEditingRealisation] = useState<Realisation | null>(null);
    const [deletingRealisation, setDeletingRealisation] = useState<Realisation | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        eventDate: new Date().toISOString().split('T')[0],
        imageUrl: undefined as string | undefined,
        categoryId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredRealisations = realisations.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openFormModal = (realisation: Realisation | null = null) => {
        setEditingRealisation(realisation);
        if (realisation) {
            setFormData({
                title: realisation.title,
                description: realisation.description || '',
                location: realisation.location,
                eventDate: new Date(realisation.eventDate).toISOString().split('T')[0],
                imageUrl: realisation.imageUrl || undefined,
                categoryId: realisation.categoryId,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                location: '',
                eventDate: new Date().toISOString().split('T')[0],
                imageUrl: undefined,
                categoryId: '',
            });
        }
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.error('Le titre est obligatoire'); return; }
        if (!formData.categoryId) { toast.error('Veuillez sélectionner une catégorie'); return; }
        if (!formData.location.trim()) { toast.error('Le lieu est obligatoire'); return; }
        if (!formData.imageUrl) { toast.error('L\'image est obligatoire'); return; }

        setIsSubmitting(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description || null,
                location: formData.location,
                eventDate: formData.eventDate,
                imageUrl: formData.imageUrl,
                categoryId: formData.categoryId,
            };

            if (editingRealisation) {
                const response = await fetch(`/api/realisations/${editingRealisation.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la modification');

                setRealisations(realisations.map(r => r.id === editingRealisation.id ? data.realisation : r));
                toast.success('Réalisation modifiée avec succès');
            } else {
                const response = await fetch('/api/realisations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

                setRealisations([data.realisation, ...realisations]);
                toast.success('Réalisation créée avec succès');
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
        if (!deletingRealisation) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/realisations/${deletingRealisation.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');

            setRealisations(realisations.filter(r => r.id !== deletingRealisation.id));
            toast.success('Réalisation supprimée avec succès');
            setIsDeleteModalOpen(false);
            setDeletingRealisation(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-dark">Réalisations</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">
                            {realisations.length} réalisation{realisations.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-text-light">Gérez les projets terrain et les actions menées.</p>
                </div>
                <button
                    onClick={() => openFormModal()}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors"
                >
                    <Plus size={18} /> Nouvelle réalisation
                </button>
            </div>

            {/* Barre de recherche */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher par titre, lieu ou catégorie..."
                        className="w-full pl-10 pr-4 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all"
                    />
                </div>
            </div>

            {/* Liste des réalisations */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredRealisations.length === 0 ? (
                    <div className="p-12 text-center">
                        <Trophy size={48} className="mx-auto text-text-light/30 mb-4" />
                        <p className="text-text-light font-medium">
                            {searchQuery ? 'Aucune réalisation ne correspond à votre recherche' : 'Aucune réalisation pour le moment'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Version Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-cream/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-4 text-xs font-semibold text-text-light uppercase w-24">Image</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Titre</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Catégorie</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Lieu</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-28">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredRealisations.map((r) => (
                                        <tr key={r.id} className="hover:bg-cream/30 transition-colors">
                                            <td className="px-4 py-4">
                                                {r.imageUrl ? (
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                        <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <ImageIcon size={20} className="text-text-light/40" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-dark text-sm truncate max-w-xs">{r.title}</p>
                                                {r.description && (
                                                    <p className="text-xs text-text-light mt-1 line-clamp-2">{r.description}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-light">{r.category?.name || 'Non catégorisé'}</td>
                                            <td className="px-6 py-4 text-sm text-text-light">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-text-light/60" />
                                                    <span className="truncate max-w-[120px]">{r.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-light">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-text-light/60" />
                                                    <span>{formatDate(r.eventDate)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openFormModal(r)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { setDeletingRealisation(r); setIsDeleteModalOpen(true); }} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Version Mobile */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {filteredRealisations.map((r) => (
                                <div key={r.id} className="p-4 space-y-3">
                                    <div className="flex gap-3">
                                        {r.imageUrl ? (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                <Trophy size={24} className="text-text-light/40" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h3 className="font-semibold text-dark text-sm line-clamp-2 flex-1">{r.title}</h3>
                                            </div>
                                            <p className="text-xs text-text-light mb-1">{r.category?.name || 'Non catégorisé'}</p>
                                            <div className="flex flex-col gap-1 text-xs text-text-light">
                                                <span className="flex items-center gap-1"><MapPin size={12} />{r.location}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(r.eventDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <button onClick={() => openFormModal(r)} className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Modifier</button>
                                        <button onClick={() => { setDeletingRealisation(r); setIsDeleteModalOpen(true); }} className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Supprimer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* MODAL : Formulaire Réalisation */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-dark">{editingRealisation ? 'Modifier la réalisation' : 'Nouvelle réalisation'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Titre */}
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">Titre du projet *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ex: Construction de 3 puits dans le village de X"
                                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-lg font-semibold outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all"
                                    required
                                />
                            </div>

                            {/* Catégorie + Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Catégorie *</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                        required
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">{`Date de l'événement *`}</label>
                                    <input
                                        type="date"
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Lieu */}
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">{`Lieu d'exécution *`}</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Ex: Goma, Nord-Kivu, RDC"
                                    className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-dark uppercase">Petit paragraphe descriptif</label>
                                    <span className="text-xs text-text-light">{formData.description.length} / 500</span>
                                </div>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })}
                                    placeholder="Décrivez brièvement le contexte, les actions menées et les résultats..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all resize-none"
                                />
                            </div>

                            {/* Image */}
                            <ImageUploader
                                value={formData.imageUrl}
                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                label="Image du projet *"
                            />

                            {/* Boutons d'action */}
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
                                    {editingRealisation ? 'Mettre à jour' : 'Créer la réalisation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL : Confirmation de suppression */}
            {isDeleteModalOpen && deletingRealisation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer cette réalisation ?</h3>
                        <p className="text-sm text-text-light mb-6">
                            Vous êtes sur le point de supprimer <strong>{deletingRealisation.title}</strong>. Cette action est irréversible.
                        </p>
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