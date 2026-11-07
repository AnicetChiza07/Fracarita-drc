'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, FileText, Image as ImageIcon, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Editor from '@/components/admin/Editor';
import ImageUploader from '@/components/admin/ImageUploader';
import CategoryModal from './CategoryModal';
import { JSONContent } from '@tiptap/react';

// ✅ AJOUT de 'export' pour pouvoir importer le type dans page.tsx
export type Article = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: JSONContent | null;
    coverImage: string | null;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: Date | null;
    createdAt: Date;
    category: { id: string; name: string } | null;
    author: { email: string } | null;
};

type Category = {
    id: string;
    name: string;
};

interface ArticlesManagerProps {
    initialArticles: Article[];
    initialCategories: Category[];
}

export default function ArticlesManager({ initialArticles, initialCategories }: ArticlesManagerProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: null as JSONContent | null,
        coverImage: undefined as string | undefined,
        categoryId: '',
        isFeatured: false,
        isPublished: false,
        publishedAt: new Date().toISOString().split('T')[0],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openFormModal = (article: Article | null = null) => {
        setEditingArticle(article);
        if (article) {
            setFormData({
                title: article.title,
                excerpt: article.excerpt || '',
                content: article.content || null,
                coverImage: article.coverImage || undefined,
                categoryId: article.category?.id || '',
                isFeatured: article.isFeatured,
                isPublished: article.isPublished,
                publishedAt: article.publishedAt 
                    ? new Date(article.publishedAt).toISOString().split('T')[0] 
                    : new Date().toISOString().split('T')[0],
            });
        } else {
            setFormData({ 
                title: '', 
                excerpt: '', 
                content: null, 
                coverImage: undefined, 
                categoryId: '', 
                isFeatured: false, 
                isPublished: false,
                publishedAt: new Date().toISOString().split('T')[0],
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
        if (!formData.content) { toast.error('Le contenu de l\'article est vide'); return; }

        setIsSubmitting(true);
        try {
            const payload = {
                title: formData.title,
                excerpt: formData.excerpt || null,
                content: formData.content,
                coverImage: formData.coverImage || null,
                categoryId: formData.categoryId,
                isFeatured: formData.isFeatured,
                isPublished: formData.isPublished,
                publishedAt: formData.publishedAt,
            };

            if (editingArticle) {
                const response = await fetch(`/api/articles/${editingArticle.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la modification');

                setArticles(articles.map(a => a.id === editingArticle.id ? data.article : a));
                toast.success('Article modifié avec succès');
            } else {
                const response = await fetch('/api/articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

                setArticles([data.article, ...articles]);
                toast.success('Article créé avec succès');
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
        if (!deletingArticle) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/articles/${deletingArticle.id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la suppression');

            setArticles(articles.filter(a => a.id !== deletingArticle.id));
            toast.success('Article supprimé avec succès');
            setIsDeleteModalOpen(false);
            setDeletingArticle(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Non définie';
        return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-dark">Articles</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">
                            {articles.length} article{articles.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-text-light">Gérez vos actualités et publications.</p>
                </div>
                <button onClick={() => openFormModal()} className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors">
                    <Plus size={18} /> Nouvel article
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/50" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher par titre ou catégorie..." 
                        className="w-full pl-10 pr-4 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all" 
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredArticles.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText size={48} className="mx-auto text-text-light/30 mb-4" />
                        <p className="text-text-light font-medium">
                            {searchQuery ? 'Aucun article ne correspond à votre recherche' : 'Aucun article pour le moment'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-cream/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-4 text-xs font-semibold text-text-light uppercase w-24">Image</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Titre</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Catégorie</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Statut</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-28">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredArticles.map((article) => (
                                        <tr key={article.id} className="hover:bg-cream/30 transition-colors">
                                            <td className="px-4 py-4">
                                                {article.coverImage ? (
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <ImageIcon size={20} className="text-text-light/40" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="font-semibold text-dark text-sm truncate">{article.title}</p>
                                                    {article.excerpt && (
                                                        <p className="text-xs text-text-light mt-1 line-clamp-2">{article.excerpt}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-light">{article.category?.name || 'Non catégorisé'}</td>
                                            <td className="px-6 py-4 text-sm text-text-light">{formatDate(article.publishedAt || article.createdAt)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${article.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {article.isPublished ? 'Publié' : 'Brouillon'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openFormModal(article)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { setDeletingArticle(article); setIsDeleteModalOpen(true); }} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
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
                            {filteredArticles.map((article) => (
                                <div key={article.id} className="p-4 space-y-3">
                                    <div className="flex gap-3">
                                        {article.coverImage ? (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                <ImageIcon size={24} className="text-text-light/40" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-dark text-sm line-clamp-2">{article.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${article.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {article.isPublished ? 'Publié' : 'Brouillon'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-light">{article.category?.name || 'Non catégorisé'}</p>
                                            <p className="text-xs text-text-light mt-1">{formatDate(article.publishedAt || article.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <button onClick={() => openFormModal(article)} className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Modifier</button>
                                        <button onClick={() => { setDeletingArticle(article); setIsDeleteModalOpen(true); }} className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Supprimer</button>
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
                            <h2 className="text-lg font-bold text-dark">{editingArticle ? 'Modifier l\'article' : 'Nouvel article'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-2 block">{`Titre de l'article *`}</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Ex: Comment l'éducation transforme des communautés entières" className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-lg font-semibold outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all" required />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-dark uppercase">Extrait (optionnel)</label>
                                    <span className="text-xs text-text-light">{formData.excerpt.length} / 300</span>
                                </div>
                                <textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value.slice(0, 300)})} placeholder="Un court résumé pour les aperçus..." rows={3} className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all resize-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Catégorie *</label>
                                    <div className="flex gap-2">
                                        <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="flex-1 px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" required>
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                        <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="px-4 py-2.5 bg-dark text-white rounded-xl font-semibold text-sm hover:bg-dark/90 transition-colors flex items-center gap-2">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block flex items-center gap-2">
                                        <Calendar size={14} /> Date de publication *
                                    </label>
                                    <input 
                                        type="date" 
                                        value={formData.publishedAt} 
                                        onChange={(e) => setFormData({...formData, publishedAt: e.target.value})} 
                                        className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" 
                                        required 
                                    />
                                    <p className="text-xs text-text-light mt-1">Date du jour par défaut, modifiable pour les anciens articles.</p>
                                </div>
                            </div>
                            <ImageUploader value={formData.coverImage} onChange={(url) => setFormData({...formData, coverImage: url})} label="Image de couverture" />
                            <div>
                                <label className="text-xs font-semibold text-dark uppercase mb-3 block">{`Contenu de l'article *`}</label>
                                <Editor value={formData.content} onChange={(content) => setFormData({...formData, content})} />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-xl">
                                <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-lime focus:ring-lime" />
                                <div>
                                    <label htmlFor="isFeatured" className="text-sm font-medium text-dark cursor-pointer">Mettre à la une</label>
                                    <p className="text-xs text-text-light">{`Afficher cet article en priorité sur la page d'accueil`}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-xl">
                                <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-lime focus:ring-lime" />
                                <div>
                                    <label htmlFor="isPublished" className="text-sm font-medium text-dark cursor-pointer">Publier immédiatement</label>
                                    <p className="text-xs text-text-light">{`Si décoché, l'article sera enregistré comme brouillon`}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream transition-colors">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                    {editingArticle ? 'Mettre à jour' : 'Créer l\'article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer cet article ?</h3>
                        <p className="text-sm text-text-light mb-6">Vous êtes sur le point de supprimer <strong>{deletingArticle.title}</strong>. Cette action est irréversible.</p>
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