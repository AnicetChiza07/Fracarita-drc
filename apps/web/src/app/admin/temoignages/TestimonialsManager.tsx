'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, MessageSquareQuote } from 'lucide-react';
import { toast } from 'sonner';

type Testimonial = {
    id: string;
    quote: string;
    authorName: string;
    role: string;
    location: string;
    initials: string;
    createdAt: Date;
    updatedAt: Date;
};

interface TestimonialsManagerProps {
    initialTestimonials: Testimonial[];
}

export default function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);

    const [formData, setFormData] = useState({
        quote: '',
        authorName: '',
        role: '',
        location: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredTestimonials = testimonials.filter((t) =>
        t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Générer les initiales à partir du nom
    const generateInitials = (name: string): string => {
        if (!name.trim()) return '';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    const openFormModal = (testimonial: Testimonial | null = null) => {
        setEditingTestimonial(testimonial);
        if (testimonial) {
            setFormData({
                quote: testimonial.quote,
                authorName: testimonial.authorName,
                role: testimonial.role,
                location: testimonial.location,
            });
        } else {
            setFormData({
                quote: '',
                authorName: '',
                role: '',
                location: '',
            });
        }
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.quote.trim()) { toast.error('Le témoignage est obligatoire'); return; }
        if (!formData.authorName.trim()) { toast.error('Le nom de l\'auteur est obligatoire'); return; }
        if (!formData.role.trim()) { toast.error('Le rôle est obligatoire'); return; }
        if (!formData.location.trim()) { toast.error('Le lieu est obligatoire'); return; }

        setIsSubmitting(true);
        try {
            const initials = generateInitials(formData.authorName);
            const payload = {
                quote: formData.quote,
                authorName: formData.authorName,
                role: formData.role,
                location: formData.location,
                initials,
            };

            if (editingTestimonial) {
                const response = await fetch(`/api/temoignages/${editingTestimonial.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la modification');

                setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? data.testimonial : t));
                toast.success('Témoignage modifié avec succès');
            } else {
                const response = await fetch('/api/temoignages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

                setTestimonials([data.testimonial, ...testimonials]);
                toast.success('Témoignage créé avec succès');
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
        if (!deletingTestimonial) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/temoignages/${deletingTestimonial.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');

            setTestimonials(testimonials.filter(t => t.id !== deletingTestimonial.id));
            toast.success('Témoignage supprimé avec succès');
            setIsDeleteModalOpen(false);
            setDeletingTestimonial(null);
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
                        <h1 className="text-2xl font-bold text-dark">Témoignages</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">
                            {testimonials.length} témoignage{testimonials.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-text-light">Gérez les témoignages des bénéficiaires et partenaires.</p>
                </div>
                <button
                    onClick={() => openFormModal()}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors"
                >
                    <Plus size={18} /> Nouveau témoignage
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
                        placeholder="Rechercher par nom, rôle ou lieu..."
                        className="w-full pl-10 pr-4 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all"
                    />
                </div>
            </div>

            {/* Liste des témoignages */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredTestimonials.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageSquareQuote size={48} className="mx-auto text-text-light/30 mb-4" />
                        <p className="text-text-light font-medium">
                            {searchQuery ? 'Aucun témoignage ne correspond à votre recherche' : 'Aucun témoignage pour le moment'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Version Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-cream/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Témoignage</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Auteur</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Lieu</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-28">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredTestimonials.map((t) => (
                                        <tr key={t.id} className="hover:bg-cream/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-dark line-clamp-2 max-w-md">{t.quote}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-lime-dark font-bold text-sm flex-shrink-0">
                                                        {t.initials || generateInitials(t.authorName)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-dark text-sm">{t.authorName}</p>
                                                        <p className="text-xs text-text-light">{t.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-light">{t.location}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openFormModal(t)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { setDeletingTestimonial(t); setIsDeleteModalOpen(true); }} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
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
                            {filteredTestimonials.map((t) => (
                                <div key={t.id} className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center text-lime-dark font-bold text-sm flex-shrink-0">
                                            {t.initials || generateInitials(t.authorName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-dark text-sm mb-1">{t.authorName}</p>
                                            <p className="text-xs text-text-light mb-2">{t.role} • {t.location}</p>
                                            <p className="text-sm text-dark line-clamp-3">{t.quote}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <button onClick={() => openFormModal(t)} className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Modifier</button>
                                        <button onClick={() => { setDeletingTestimonial(t); setIsDeleteModalOpen(true); }} className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Supprimer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* MODAL : Formulaire Témoignage */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-dark">{editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Témoignage */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-dark uppercase">Témoignage *</label>
                                    <span className="text-xs text-text-light">{formData.quote.length} / 1000</span>
                                </div>
                                <textarea
                                    value={formData.quote}
                                    onChange={(e) => setFormData({ ...formData, quote: e.target.value.slice(0, 1000) })}
                                    placeholder="Ex: Grâce à Fracarita, j'ai pu envoyer mes 3 enfants à l'école. Aujourd'hui, l'aînée est infirmière et travaille à l'hôpital de Goma..."
                                    rows={6}
                                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all resize-none"
                                    required
                                />
                            </div>

                            {/* Nom + Rôle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">{`Nom de l'auteur *`}</label>
                                    <input
                                        type="text"
                                        value={formData.authorName}
                                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                        placeholder="Ex: Marie Kabasele"
                                        className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Rôle / Fonction *</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="Ex: Mère bénéficiaire, Professeur, Chef de village..."
                                        className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Lieu */}
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">Lieu *</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Ex: Goma, Nord-Kivu, RDC"
                                    className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                    required
                                />
                            </div>

                            {/* Aperçu des initiales */}
                            {formData.authorName && (
                                <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center text-lime-dark font-bold text-lg">
                                        {generateInitials(formData.authorName)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-dark">Aperçu des initiales</p>
                                        <p className="text-xs text-text-light">Générées automatiquement à partir du nom</p>
                                    </div>
                                </div>
                            )}

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
                                    {editingTestimonial ? 'Mettre à jour' : 'Créer le témoignage'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL : Confirmation de suppression */}
            {isDeleteModalOpen && deletingTestimonial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer ce témoignage ?</h3>
                        <p className="text-sm text-text-light mb-6">
                            Vous êtes sur le point de supprimer le témoignage de <strong>{deletingTestimonial.authorName}</strong>. Cette action est irréversible.
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