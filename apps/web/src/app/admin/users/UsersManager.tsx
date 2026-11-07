'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Users, Mail, Shield, ShieldCheck, ShieldAlert, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

// Type dédié pour les rôles
type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';

type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
};

interface UsersManagerProps {
    initialUsers: User[];
    currentUserId: string;
    currentUserRole: string;
}

const ROLE_LABELS: Record<UserRole, { label: string; color: string; icon: typeof Shield }> = {
    SUPER_ADMIN: { label: 'Super Admin', color: 'bg-red-100 text-red-800', icon: ShieldAlert },
    EDITOR: { label: 'Éditeur', color: 'bg-blue-100 text-blue-800', icon: Shield },
    VIEWER: { label: 'Lecteur', color: 'bg-gray-100 text-gray-800', icon: ShieldCheck },
};

export default function UsersManager({ initialUsers, currentUserId, currentUserRole }: UsersManagerProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({ name: '', email: '', role: 'EDITOR' as UserRole });
    const [editFormData, setEditFormData] = useState({ role: 'EDITOR' as UserRole, isActive: true });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'EDITOR' });
        setGeneratedPassword('');
        setIsCopied(false);
        setIsFormModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditFormData({ role: user.role, isActive: user.isActive });
        setGeneratedPassword('');
        setIsFormModalOpen(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Réponse non-JSON reçue:', text);
                throw new Error('Le serveur a retourné une réponse invalide.');
            }

            if (!response.ok) throw new Error(data.error || 'Erreur lors de la création');

            setUsers([data.user, ...users]);
            toast.success('Utilisateur créé avec succès');
            
            // ✅ Affiche le mot de passe généré
            if (data.tempPassword) {
                setGeneratedPassword(data.tempPassword);
                toast.info('Mot de passe généré : copiez-le et communiquez-le à l\'utilisateur.');
            } else {
                setIsFormModalOpen(false);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            toast.error(message);
            console.error('Erreur handleCreate:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setUsers(users.map(u => u.id === editingUser.id ? data.user : u));
            toast.success('Utilisateur mis à jour');
            setIsFormModalOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Erreur');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingUser) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/users/${deletingUser.id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setUsers(users.filter(u => u.id !== deletingUser.id));
            toast.success('Utilisateur supprimé');
            setIsDeleteModalOpen(false);
            setDeletingUser(null);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Erreur');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyPassword = async () => {
        try {
            await navigator.clipboard.writeText(generatedPassword);
            setIsCopied(true);
            toast.success('Mot de passe copié dans le presse-papier !');
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            toast.error('Erreur lors de la copie');
        }
    };

    const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-dark">Utilisateurs</h1>
                        <span className="px-3 py-1 bg-lime/20 text-lime-dark rounded-full text-xs font-semibold">{users.length} admin{users.length > 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-sm text-text-light">{`Gérez les accès et les rôles de l'équipe.`}</p>
                </div>
                {isSuperAdmin && (
                    <button onClick={openCreateModal} className="inline-flex items-center justify-center gap-2 bg-lime text-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors">
                        <Plus size={18} /> Nouvel utilisateur
                    </button>
                )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/50" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher par nom ou email..." className="w-full pl-10 pr-4 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredUsers.length === 0 ? (
                    <div className="p-12 text-center"><Users size={48} className="mx-auto text-text-light/30 mb-4" /><p className="text-text-light font-medium">Aucun utilisateur trouvé</p></div>
                ) : (
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-cream/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Utilisateur</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Rôle</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Statut</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-28">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => {
                                    const RoleInfo = ROLE_LABELS[user.role];
                                    const RoleIcon = RoleInfo.icon;
                                    return (
                                        <tr key={user.id} className="hover:bg-cream/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-lime-dark font-bold text-sm flex-shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-dark text-sm">{user.name} {user.id === currentUserId && <span className="text-xs text-lime-dark font-normal">(Vous)</span>}</p>
                                                        <p className="text-xs text-text-light">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${RoleInfo.color}`}>
                                                    <RoleIcon size={14} /> {RoleInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                                    {user.isActive ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {isSuperAdmin && user.id !== currentUserId && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openEditModal(user)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                                        <button onClick={() => { setDeletingUser(user); setIsDeleteModalOpen(true); }} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Version Mobile */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredUsers.map((user) => {
                        const RoleInfo = ROLE_LABELS[user.role];
                        return (
                            <div key={user.id} className="p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-lime-dark font-bold text-sm">{user.name.charAt(0).toUpperCase()}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-dark text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-text-light truncate">{user.email}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{user.isActive ? 'Actif' : 'Inactif'}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${RoleInfo.color}`}><RoleInfo.icon size={12} /> {RoleInfo.label}</span>
                                    {isSuperAdmin && user.id !== currentUserId && (
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(user)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg">Modifier</button>
                                            <button onClick={() => { setDeletingUser(user); setIsDeleteModalOpen(true); }} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg">Supprimer</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MODAL : Création / Édition */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-dark">{editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h2>
                            <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        
                        {editingUser ? (
                            <form onSubmit={handleUpdate} className="p-6 space-y-4">
                                <div className="p-4 bg-cream/50 rounded-xl">
                                    <p className="text-sm font-medium text-dark">{editingUser.name}</p>
                                    <p className="text-xs text-text-light">{editingUser.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-dark uppercase mb-2 block">Rôle</label>
                                    <select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime">
                                        <option value="SUPER_ADMIN">Super Administrateur</option>
                                        <option value="EDITOR">Éditeur</option>
                                        <option value="VIEWER">Lecteur</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-xl">
                                    <input type="checkbox" id="isActive" checked={editFormData.isActive} onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-lime focus:ring-lime" />
                                    <label htmlFor="isActive" className="text-sm font-medium text-dark cursor-pointer">Compte actif (peut se connecter)</label>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream">Annuler</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isSubmitting && <Loader2 size={16} className="animate-spin" />} Enregistrer
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                {generatedPassword ? (
                                    <div className="space-y-4">
                                        <div className="p-5 bg-green-50 border border-green-200 rounded-xl text-center">
                                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Check size={28} className="text-green-600" />
                                            </div>
                                            <p className="text-base font-bold text-green-800 mb-2">Utilisateur créé avec succès !</p>
                                            <p className="text-xs text-green-700 mb-4 leading-relaxed">
                                                {`L'envoi d'email étant désactivé, veuillez communiquer ce mot de passe temporairement à l'utilisateur par un canal sécurisé (WhatsApp, téléphone, etc.).`}
                                            </p>
                                            
                                            <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                                                <p className="text-[10px] uppercase font-bold text-text-light mb-1.5 tracking-wider">Mot de passe temporaire</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="flex-1 text-lg font-mono font-bold text-dark tracking-wider break-all">{generatedPassword}</code>
                                                    <button 
                                                        type="button" 
                                                        onClick={copyPassword} 
                                                        className={`p-2.5 rounded-md transition-all flex items-center gap-1.5 font-semibold text-xs ${
                                                            isCopied 
                                                                ? 'bg-green-600 text-white' 
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                    >
                                                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                                        {isCopied ? 'Copié' : 'Copier'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => { setIsFormModalOpen(false); setGeneratedPassword(''); }} 
                                            className="w-full py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark transition-colors"
                                        >
                                            Fermer et retourner à la liste
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-dark uppercase mb-2 block">Nom complet *</label>
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-dark uppercase mb-2 block">Adresse email *</label>
                                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime" required />
                                            <p className="text-xs text-text-light mt-1">{`Un email ne peut être utilisé qu'une seule fois.`}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-dark uppercase mb-2 block">Rôle *</label>
                                            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })} className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime">
                                                <option value="EDITOR">Éditeur</option>
                                                <option value="VIEWER">Lecteur</option>
                                                <option value="SUPER_ADMIN">Super Administrateur</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                                            <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream">Annuler</button>
                                            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 flex items-center justify-center gap-2">
                                                {isSubmitting && <Loader2 size={16} className="animate-spin" />} Créer
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL : Suppression */}
            {isDeleteModalOpen && deletingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-600" /></div>
                        <h3 className="text-lg font-bold text-dark mb-2">Supprimer cet utilisateur ?</h3>
                        <p className="text-sm text-text-light mb-6">Vous êtes sur le point de supprimer <strong>{deletingUser.name}</strong>. Cette action est irréversible.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-cream">Annuler</button>
                            <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSubmitting && <Loader2 size={16} className="animate-spin" />} Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}