'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Briefcase, MapPin, Calendar, Image as ImageIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Editor from '@/components/admin/Editor';
import ImageUploader from '@/components/admin/ImageUploader';
import PdfUploader from '@/components/admin/PdfUploader';
import CategoryModal from '../articles/CategoryModal';
import { JSONContent } from '@tiptap/react';

type Opportunite = {
    id: string;
    title: string;
    slug: string;
    type: 'JOB' | 'INTERNSHIP' | 'TENDER';
    location: string;
    contractType: string | null;
    experienceLevel: string | null;
    description: JSONContent | null;
    deadline: Date | null;
    isPublished: boolean;
    coverImage: string | null;
    pdfName: string | null;
    pdfUrl: string | null;
    pdfSize: string | null;
    createdAt: Date;
    category: { id: string; name: string } | null;
};

type Category = {
    id: string;
    name: string;
};

interface OpportunitesManagerProps {
    initialOpportunites: Opportunite[];
    initialCategories: Category[];
}

const OPPORTUNITY_TYPES = {
    JOB: { label: 'Emploi', color: 'bg-blue-100 text-blue-800' },
    INTERNSHIP: { label: 'Stage', color: 'bg-purple-100 text-purple-800' },
    TENDER: { label: 'Appel d\'offres', color: 'bg-orange-100 text-orange-800' },
};

const CONTRACT_TYPES = ['CDI', 'CDD', 'Stage', 'Freelance', 'Consultation', 'Autre'];
const EXPERIENCE_LEVELS = ['Débutant', 'Junior', 'Confirmé', 'Senior', 'Expert'];

export default function OpportunitesManager({ initialOpportunites, initialCategories }: OpportunitesManagerProps) {
    const [opportunites, setOpportunites] = useState<Opportunite[]>(initialOpportunites);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingOpportunite, setEditingOpportunite] = useState<Opportunite | null>(null);
    const [deletingOpportunite, setDeletingOpportunite] = useState<Opportunite | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'JOB' as 'JOB' | 'INTERNSHIP' | 'TENDER',
        categoryId: '',
        location: '',
        contractType: '',
        experienceLevel: '',
        deadline: '',
        description: null as JSONContent | null,
        coverImage: undefined as string | undefined,
        pdfName: undefined as string | undefined,
        pdfUrl: undefined as string | undefined,
        pdfSize: undefined as string | undefined,
        isPublished: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredOpportunites = opportunites.filter((opp) =>
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openFormModal = (opportunite: Opportunite | null = null) => {
        setEditingOpportunite(opportunite);
        if (opportunite) {
            setFormData({
                title: opportunite.title,
                type: opportunite.type,
                categoryId: opportunite.category?.id || '',
                location: opportunite.location,
                contractType: opportunite.contractType || '',
                experienceLevel: opportunite.experienceLevel || '',
                deadline: opportunite.deadline ? new Date(opportunite.deadline).toISOString().split('T')[0] : '',
                description: opportunite.description || null,
                coverImage: opportunite.coverImage || undefined,
                pdfName: opportunite.pdfName || undefined,
                pdfUrl: opportunite.pdfUrl || undefined,
                pdfSize: opportunite.pdfSize || undefined,
                isPublished: opportunite.isPublished,
            });
        } else {
            setFormData({
                title: '',
                type: 'JOB',
                categoryId: '',
                location: '',
                contractType: '',
                experienceLevel: '',
                deadline: '',
                description: null,
                coverImage: undefined,
                pdfName: undefined,
                pdfUrl: undefined,
                pdfSize: undefined,
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
        if (!formData.location.trim()) { toast.error('Le lieu est obligatoire'); return; }
        if (!formData.description) { toast.error('La description est obligatoire'); return; }

        setIsSubmitting(true);
        try {
            const payload = {
                title: formData.title,
                type: formData.type,
                categoryId: formData.categoryId,
                location: formData.location,
                contractType: formData.contractType || null,
                experienceLevel: formData.experienceLevel || null,
                deadline: formData.deadline || null,
                description: formData.description,
                coverImage: formData.coverImage || null,
                pdfName: formData.pdfName || null,
                pdfUrl: formData.pdfUrl || null,
                pdfSize: formData.pdfSize || null,
                isPublished: formData.isPublished,
            };

            if (editingOpportunite) {
                const response = await fetch(`/api/opportunites/${editingOpportunite.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la modification');

                setOpportunites(opportunites.map(o => o.id === editingOpportunite.id ? data.opportunity : o));
                toast.success('Opportunité modifiée avec succès');
            } else {
                const response = await fetch('/api/opportunites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

                setOpportunites([data.opportunity, ...opportunites]);
                toast.success('Opportunité créée avec succès');
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
        if (!deletingOpportunite) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/opportunites/${deletingOpportunite.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');

            setOpportunites(opportunites.filter(o => o.id !== deletingOpportunite.id));
            toast.success('Opportunité supprimée avec succès');
            setIsDeleteModalOpen(false);
            setDeletingOpportunite(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDeadline = (date: Date | null) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-dark">Opportunités</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">
                            {opportunites.length} opportunit{opportunites.length > 1 ? 'és' : 'é'}
                        </span>
                    </div>
                    <p className="text-sm text-text-light">{`Gérez les offres d'emploi, stages et appels d'offres.`}</p>
                </div>
                <button onClick={() => openFormModal()} className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors">
                    <Plus size={18} /> Nouvelle opportunité
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/50" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher par titre, lieu ou catégorie..." className="w-full pl-10 pr-4 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredOpportunites.length === 0 ? (
                    <div className="p-12 text-center">
                        <Briefcase size={48} className="mx-auto text-text-light/30 mb-4" />
                        <p className="text-text-light font-medium">{searchQuery ? 'Aucune opportunité ne correspond à votre recherche' : 'Aucune opportunité pour le moment'}</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-cream/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-4 text-xs font-semibold text-text-light uppercase w-24">Image</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Titre</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Type</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Lieu</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Date limite</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">PDF</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Statut</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-28">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOpportunites.map((opp) => (
                                        <tr key={opp.id} className="hover:bg-cream/30 transition-colors">
                                            <td className="px-4 py-4">
                                                {opp.coverImage ? (
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                        <img src={opp.coverImage} alt={opp.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <ImageIcon size={20} className="text-text-light/40" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-dark text-sm truncate max-w-xs">{opp.title}</p>
                                                <p className="text-xs text-text-light mt-1">{opp.category?.name || 'Non catégorisé'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${OPPORTUNITY_TYPES[opp.type].color}`}>
                                                    {OPPORTUNITY_TYPES[opp.type].label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-light">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-text-light/60" />
                                                    <span className="truncate max-w-[120px]">{opp.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-light">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-text-light/60" />
                                                    <span>{formatDeadline(opp.deadline)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {opp.pdfUrl ? (
                                                    <a href={opp.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors" title="Télécharger le PDF">
                                                        <FileText size={14} />
                                                        <span className="truncate max-w-[100px]">{opp.pdfName || 'Document'}</span>
                                                        <span className="text-red-400">({opp.pdfSize})</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-text-light/40 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${opp.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {opp.isPublished ? 'Publié' : 'Brouillon'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openFormModal(opp)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { setDeletingOpportunite(opp); setIsDeleteModalOpen(true); }} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y divide-gray-100">
                            {filteredOpportunites.map((opp) => (
                                <div key={opp.id} className="p-4 space-y-3">
                                    <div className="flex gap-3">
                                        {opp.coverImage ? (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img src={opp.coverImage} alt={opp.title} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                <Briefcase size={24} className="text-text-light/40" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h3 className="font-semibold text-dark text-sm line-clamp-2 flex-1">{opp.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${OPPORTUNITY_TYPES[opp.type].color}`}>
                                                    {OPPORTUNITY_TYPES[opp.type].label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-light mb-1">{opp.category?.name || 'Non catégorisé'}</p>
                                            <div className="flex items-center gap-3 text-xs text-text-light">
                                                <span className="flex items-center gap-1"><MapPin size={12} />{opp.location}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} />{formatDeadline(opp.deadline)}</span>
                                            </div>
                                            {opp.pdfUrl && (
                                                <a href={opp.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium w-fit">
                                                    <FileText size={12} />
                                                    <span>{opp.pdfName || 'PDF'} ({opp.pdfSize})</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${opp.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {opp.isPublished ? 'Publié' : 'Brouillon'}
                                        </span>
                                        <div className="flex gap-2">
                                            <button onClick={() => openFormModal(opp)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Modifier</button>
                                            <button onClick={() => { setDeletingOpportunite(opp); setIsDeleteModalOpen(true); }} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Supprimer</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-dark">{editingOpportunite ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">Titre *</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Responsable de projet éducatif" className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-lg font-semibold outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Type *</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'JOB' | 'INTERNSHIP' | 'TENDER' })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" required>
                                        <option value="JOB">Emploi</option>
                                        <option value="INTERNSHIP">Stage</option>
                                        <option value="TENDER">{`Appel d'offres`}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Catégorie *</label>
                                    <div className="flex gap-2">
                                        <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="flex-1 px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" required>
                                            <option value="">Sélectionner</option>
                                            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                        <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="px-3 py-2.5 bg-dark text-white rounded-xl font-semibold text-sm hover:bg-dark/90 transition-colors" title="Nouvelle catégorie">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Lieu *</label>
                                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Ex: Goma, RDC" className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" required />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Type de contrat</label>
                                    <select value={formData.contractType} onChange={(e) => setFormData({ ...formData, contractType: e.target.value })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all">
                                        <option value="">Sélectionner</option>
                                        {CONTRACT_TYPES.map(ct => (<option key={ct} value={ct}>{ct}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">{`Niveau d'expérience`}</label>
                                    <select value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all">
                                        <option value="">Sélectionner</option>
                                        {EXPERIENCE_LEVELS.map(el => (<option key={el} value={el}>{el}</option>))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Date limite de candidature</label>
                                    <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" />
                                </div>
                                <PdfUploader
                                    value={formData.pdfUrl}
                                    name={formData.pdfName}
                                    onChange={(url, name, size) => setFormData({ ...formData, pdfUrl: url, pdfName: name, pdfSize: size })}
                                    label="PDF de l'offre (téléchargeable)"
                                />
                            </div>

                            <ImageUploader value={formData.coverImage} onChange={(url) => setFormData({ ...formData, coverImage: url })} label="Image de couverture (optionnelle)" />

                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-3 block">Description *</label>
                                <Editor value={formData.description} onChange={(content) => setFormData({ ...formData, description: content })} />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-xl">
                                <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-lime focus:ring-lime" />
                                <div>
                                    <label htmlFor="isPublished" className="text-sm font-medium text-dark cursor-pointer">Publier immédiatement</label>
                                    <p className="text-xs text-text-light">{`Si décoché, l'opportunité sera enregistrée comme brouillon`}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream transition-colors">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                    {editingOpportunite ? 'Mettre à jour' : 'Créer l\'opportunité'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingOpportunite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer cette opportunité ?</h3>
                        <p className="text-sm text-text-light mb-6">Vous êtes sur le point de supprimer <strong>{deletingOpportunite.title}</strong>. Cette action est irréversible.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream transition-colors">Annuler</button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                                {isSubmitting && <Loader2 size={16} className="animate-spin" />} Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onCategoryCreated={handleCategoryCreated} />
        </div>
    );
}