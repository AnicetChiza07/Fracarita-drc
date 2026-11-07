'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, FileBarChart, FileText, Calendar, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';
import PdfUploader from '@/components/admin/PdfUploader';
import ReportCategoryModal from './ReportCategoryModal';

type Rapport = {
    id: string;
    title: string;
    year: number;
    description: string | null;
    pdfName: string | null;
    pdfUrl: string | null;
    pdfSize: string | null;
    coverImage: string | null;
    isPublished: boolean;
    createdAt: Date;
    category: { id: string; name: string } | null;
};

type Category = {
    id: string;
    name: string;
};

interface RapportsManagerProps {
    initialRapports: Rapport[];
    initialCategories: Category[];
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

export default function RapportsManager({ initialRapports, initialCategories }: RapportsManagerProps) {
    const [rapports, setRapports] = useState<Rapport[]>(initialRapports);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingRapport, setEditingRapport] = useState<Rapport | null>(null);
    const [deletingRapport, setDeletingRapport] = useState<Rapport | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        year: CURRENT_YEAR,
        description: '',
        categoryId: '',
        pdfName: undefined as string | undefined,
        pdfUrl: undefined as string | undefined,
        pdfSize: undefined as string | undefined,
        coverImage: undefined as string | undefined,
        isPublished: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredRapports = rapports.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.year.toString().includes(searchQuery)
    );

    const openFormModal = (rapport: Rapport | null = null) => {
        setEditingRapport(rapport);
        if (rapport) {
            setFormData({
                title: rapport.title,
                year: rapport.year,
                description: rapport.description || '',
                categoryId: rapport.category?.id || '',
                pdfName: rapport.pdfName || undefined,
                pdfUrl: rapport.pdfUrl || undefined,
                pdfSize: rapport.pdfSize || undefined,
                coverImage: rapport.coverImage || undefined,
                isPublished: rapport.isPublished,
            });
        } else {
            setFormData({
                title: '',
                year: CURRENT_YEAR,
                description: '',
                categoryId: '',
                pdfName: undefined,
                pdfUrl: undefined,
                pdfSize: undefined,
                coverImage: undefined,
                isPublished: false,
            });
        }
        setIsFormModalOpen(true);
    };

    const handleCategoryCreated = (newCategory: Category) => {
        setCategories([...categories, newCategory]);
        setFormData({ ...formData, categoryId: newCategory.id });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.error('Le titre est obligatoire'); return; }
        if (!formData.categoryId) { toast.error('Veuillez sélectionner une catégorie'); return; }
        if (!formData.pdfUrl) { toast.error('Le PDF est obligatoire'); return; }

        setIsSubmitting(true);
        try {
            const payload = {
                title: formData.title,
                year: formData.year,
                description: formData.description || null,
                categoryId: formData.categoryId,
                pdfName: formData.pdfName || null,
                pdfUrl: formData.pdfUrl,
                pdfSize: formData.pdfSize || null,
                coverImage: formData.coverImage || null,
                isPublished: formData.isPublished,
            };

            if (editingRapport) {
                const response = await fetch(`/api/rapports/${editingRapport.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la modification');

                setRapports(rapports.map(r => r.id === editingRapport.id ? data.report : r));
                toast.success('Rapport modifié avec succès');
            } else {
                const response = await fetch('/api/rapports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

                setRapports([data.report, ...rapports]);
                toast.success('Rapport créé avec succès');
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
        if (!deletingRapport) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/rapports/${deletingRapport.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');

            setRapports(rapports.filter(r => r.id !== deletingRapport.id));
            toast.success('Rapport supprimé avec succès');
            setIsDeleteModalOpen(false);
            setDeletingRapport(null);
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
                        <h1 className="text-2xl font-bold text-dark">Rapports</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">
                            {rapports.length} rapport{rapports.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-text-light">{`Gérez les rapports d'activités, financiers et d'impact.`}</p>
                </div>
                <button
                    onClick={() => openFormModal()}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors"
                >
                    <Plus size={18} /> Nouveau rapport
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
                        placeholder="Rechercher par titre, année ou catégorie..."
                        className="w-full pl-10 pr-4 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all"
                    />
                </div>
            </div>

            {/* Liste des rapports */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredRapports.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileBarChart size={48} className="mx-auto text-text-light/30 mb-4" />
                        <p className="text-text-light font-medium">
                            {searchQuery ? 'Aucun rapport ne correspond à votre recherche' : 'Aucun rapport pour le moment'}
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
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Année</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">PDF</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Statut</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-28">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredRapports.map((rapport) => (
                                        <tr key={rapport.id} className="hover:bg-cream/30 transition-colors">
                                            <td className="px-4 py-4">
                                                {rapport.coverImage ? (
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                        <img src={rapport.coverImage} alt={rapport.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <FileBarChart size={20} className="text-text-light/40" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-dark text-sm truncate max-w-xs">{rapport.title}</p>
                                                {rapport.description && (
                                                    <p className="text-xs text-text-light mt-1 line-clamp-1">{rapport.description}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-light">{rapport.category?.name || 'Non catégorisé'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-text-light/60" />
                                                    <span className="text-sm text-text-light font-medium">{rapport.year}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {rapport.pdfUrl ? (
                                                    <a href={rapport.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors" title="Télécharger le PDF">
                                                        <FileText size={14} />
                                                        <span className="truncate max-w-[100px]">{rapport.pdfName || 'Document'}</span>
                                                        <span className="text-red-400">({rapport.pdfSize})</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-text-light/40 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${rapport.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {rapport.isPublished ? 'Publié' : 'Brouillon'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openFormModal(rapport)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { setDeletingRapport(rapport); setIsDeleteModalOpen(true); }} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
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
                            {filteredRapports.map((rapport) => (
                                <div key={rapport.id} className="p-4 space-y-3">
                                    <div className="flex gap-3">
                                        {rapport.coverImage ? (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img src={rapport.coverImage} alt={rapport.title} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                <FileBarChart size={24} className="text-text-light/40" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h3 className="font-semibold text-dark text-sm line-clamp-2 flex-1">{rapport.title}</h3>
                                                <span className="text-xs text-text-light font-medium flex-shrink-0">{rapport.year}</span>
                                            </div>
                                            <p className="text-xs text-text-light mb-1">{rapport.category?.name || 'Non catégorisé'}</p>
                                            {rapport.pdfUrl && (
                                                <a href={rapport.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium w-fit">
                                                    <FileText size={12} />
                                                    <span>{rapport.pdfName || 'PDF'} ({rapport.pdfSize})</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${rapport.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {rapport.isPublished ? 'Publié' : 'Brouillon'}
                                        </span>
                                        <div className="flex gap-2">
                                            <button onClick={() => openFormModal(rapport)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Modifier</button>
                                            <button onClick={() => { setDeletingRapport(rapport); setIsDeleteModalOpen(true); }} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Supprimer</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* MODAL : Formulaire Rapport */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-dark">{editingRapport ? 'Modifier le rapport' : 'Nouveau rapport'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Titre */}
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">Titre du rapport *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ex: Rapport d'activités annuel 2025"
                                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-lg font-semibold outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all"
                                    required
                                />
                            </div>

                            {/* Année + Catégorie */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Année *</label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                        required
                                    >
                                        {YEAR_OPTIONS.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Catégorie *</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="flex-1 px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                            required
                                        >
                                            <option value="">Sélectionner</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryModalOpen(true)}
                                            className="px-3 py-2.5 bg-dark text-white rounded-xl font-semibold text-sm hover:bg-dark/90 transition-colors"
                                            title="Nouvelle catégorie"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-dark uppercase">Description (optionnelle)</label>
                                    <span className="text-xs text-text-light">{formData.description.length} / 500</span>
                                </div>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })}
                                    placeholder="Un court résumé du contenu du rapport..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all resize-none"
                                />
                            </div>

                            {/* Image de couverture */}
                            <ImageUploader
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                label="Image de couverture (optionnelle)"
                            />

                            {/* PDF du rapport */}
                            <PdfUploader
                                value={formData.pdfUrl}
                                name={formData.pdfName}
                                onChange={(url, name, size) => setFormData({ ...formData, pdfUrl: url, pdfName: name, pdfSize: size })}
                                label="Fichier PDF du rapport *"
                            />

                            {/* Option publication */}
                            <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-lime focus:ring-lime"
                                />
                                <div>
                                    <label htmlFor="isPublished" className="text-sm font-medium text-dark cursor-pointer">Publier immédiatement</label>
                                    <p className="text-xs text-text-light">Si décoché, le rapport sera enregistré comme brouillon</p>
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
                                    {editingRapport ? 'Mettre à jour' : 'Créer le rapport'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL : Confirmation de suppression */}
            {isDeleteModalOpen && deletingRapport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer ce rapport ?</h3>
                        <p className="text-sm text-text-light mb-6">
                            Vous êtes sur le point de supprimer <strong>{deletingRapport.title}</strong>. Cette action est irréversible.
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

            {/* MODAL : Nouvelle Catégorie de rapport */}
            <ReportCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onCategoryCreated={handleCategoryCreated}
            />
        </div>
    );
}