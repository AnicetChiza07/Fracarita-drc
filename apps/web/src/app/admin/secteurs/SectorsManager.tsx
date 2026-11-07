'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Globe, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';

type Stat = {
    value: string;
    label: string;
};

type Sector = {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    stats: Stat[];
    createdAt: Date;
    updatedAt: Date;
};

interface SectorsManagerProps {
    initialSectors: Sector[];
}

export default function SectorsManager({ initialSectors }: SectorsManagerProps) {
    const [sectors, setSectors] = useState<Sector[]>(initialSectors);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingSector, setEditingSector] = useState<Sector | null>(null);
    const [deletingSector, setDeletingSector] = useState<Sector | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        subtitle: '',
        description: '',
        imageUrl: undefined as string | undefined,
        stats: [] as Stat[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openFormModal = (sector: Sector | null = null) => {
        setEditingSector(sector);
        if (sector) {
            setFormData({
                name: sector.name,
                subtitle: sector.subtitle,
                description: sector.description,
                imageUrl: sector.imageUrl || undefined,
                stats: sector.stats || [],
            });
        } else {
            setFormData({
                name: '',
                subtitle: '',
                description: '',
                imageUrl: undefined,
                stats: [],
            });
        }
        setIsFormModalOpen(true);
    };

    const addStat = () => {
        setFormData({ ...formData, stats: [...formData.stats, { value: '', label: '' }] });
    };

    const removeStat = (index: number) => {
        setFormData({ ...formData, stats: formData.stats.filter((_, i) => i !== index) });
    };

    const updateStat = (index: number, field: 'value' | 'label', newValue: string) => {
        const newStats = [...formData.stats];
        newStats[index] = { ...newStats[index], [field]: newValue };
        setFormData({ ...formData, stats: newStats });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) { toast.error('Le nom est obligatoire'); return; }
        if (!formData.subtitle.trim()) { toast.error('Le sous-titre est obligatoire'); return; }
        if (!formData.description.trim()) { toast.error('La description est obligatoire'); return; }
        if (!formData.imageUrl) { toast.error('L\'image est obligatoire'); return; }

        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                subtitle: formData.subtitle,
                description: formData.description,
                imageUrl: formData.imageUrl,
                stats: formData.stats.filter(s => s.value && s.label), // Filtrer les stats vides
            };

            if (editingSector) {
                const response = await fetch(`/api/secteurs/${editingSector.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la modification');

                setSectors(sectors.map(s => s.id === editingSector.id ? data.sector : s).sort((a, b) => a.name.localeCompare(b.name)));
                toast.success('Secteur modifié avec succès');
            } else {
                const response = await fetch('/api/secteurs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

                setSectors([...sectors, data.sector].sort((a, b) => a.name.localeCompare(b.name)));
                toast.success('Secteur créé avec succès');
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
        if (!deletingSector) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/secteurs/${deletingSector.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');

            setSectors(sectors.filter(s => s.id !== deletingSector.id));
            toast.success('Secteur supprimé avec succès');
            setIsDeleteModalOpen(false);
            setDeletingSector(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-dark">{`Secteurs d'intervention`}</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">
                            {sectors.length} secteur{sectors.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-text-light">{`Gérez les domaines d'intervention de Fracarita.`}</p>
                </div>
                <button
                    onClick={() => openFormModal()}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors"
                >
                    <Plus size={18} /> Nouveau secteur
                </button>
            </div>

            {/* Liste des secteurs */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {sectors.length === 0 ? (
                    <div className="p-12 text-center">
                        <Globe size={48} className="mx-auto text-text-light/30 mb-4" />
                        <p className="text-text-light font-medium">Aucun secteur pour le moment</p>
                    </div>
                ) : (
                    <>
                        {/* Version Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-cream/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-4 text-xs font-semibold text-text-light uppercase w-24">Image</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Secteur</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Statistiques</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-28">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sectors.map((sector) => (
                                        <tr key={sector.id} className="hover:bg-cream/30 transition-colors">
                                            <td className="px-4 py-4">
                                                {sector.imageUrl ? (
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                        <img src={sector.imageUrl} alt={sector.name} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <ImageIcon size={20} className="text-text-light/40" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-dark text-sm">{sector.name}</p>
                                                <p className="text-xs text-text-light mt-1 line-clamp-1">{sector.subtitle}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {sector.stats.slice(0, 3).map((stat, i) => (
                                                        <span key={i} className="px-2 py-1 bg-lime/10 text-lime-dark text-xs rounded-md font-medium">
                                                            {stat.value} {stat.label}
                                                        </span>
                                                    ))}
                                                    {sector.stats.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-text-light text-xs rounded-md">
                                                            +{sector.stats.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openFormModal(sector)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { setDeletingSector(sector); setIsDeleteModalOpen(true); }} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
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
                            {sectors.map((sector) => (
                                <div key={sector.id} className="p-4 space-y-3">
                                    <div className="flex gap-3">
                                        {sector.imageUrl ? (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img src={sector.imageUrl} alt={sector.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                <Globe size={24} className="text-text-light/40" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-dark text-sm mb-1">{sector.name}</h3>
                                            <p className="text-xs text-text-light mb-2 line-clamp-2">{sector.subtitle}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {sector.stats.slice(0, 2).map((stat, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-lime/10 text-lime-dark text-[10px] rounded font-medium">
                                                        {stat.value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <button onClick={() => openFormModal(sector)} className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Modifier</button>
                                        <button onClick={() => { setDeletingSector(sector); setIsDeleteModalOpen(true); }} className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Supprimer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* MODAL : Formulaire Secteur */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-dark">{editingSector ? 'Modifier le secteur' : 'Nouveau secteur'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Nom */}
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">Nom du secteur *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Éducation, Santé, Eau..."
                                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-lg font-semibold outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all"
                                    required
                                />
                            </div>

                            {/* Sous-titre */}
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">Sous-titre *</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="Une phrase courte qui résume le secteur"
                                    className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-dark uppercase">Description *</label>
                                    <span className="text-xs text-text-light">{formData.description.length} / 1000</span>
                                </div>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 1000) })}
                                    placeholder="Décrivez les actions menées dans ce secteur..."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all resize-none"
                                    required
                                />
                            </div>

                            {/* Image */}
                            <ImageUploader
                                value={formData.imageUrl}
                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                label="Image du secteur *"
                            />

                            {/* Statistiques dynamiques */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-semibold text-dark uppercase">Statistiques clés</label>
                                    <button
                                        type="button"
                                        onClick={addStat}
                                        className="text-xs text-lime-dark hover:text-lime font-medium flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Ajouter une stat
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.stats.map((stat, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={stat.value}
                                                onChange={(e) => updateStat(index, 'value', e.target.value)}
                                                placeholder="Ex: 500+"
                                                className="flex-1 px-3 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all"
                                            />
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                placeholder="Ex: Femmes formées"
                                                className="flex-2 px-3 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeStat(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.stats.length === 0 && (
                                        <p className="text-xs text-text-light text-center py-4">Aucune statistique ajoutée</p>
                                    )}
                                </div>
                            </div>

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
                                    {editingSector ? 'Mettre à jour' : 'Créer le secteur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL : Confirmation de suppression */}
            {isDeleteModalOpen && deletingSector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer ce secteur ?</h3>
                        <p className="text-sm text-text-light mb-6">
                            Vous êtes sur le point de supprimer <strong>{deletingSector.name}</strong>. Cette action est irréversible.
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