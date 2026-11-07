'use client';

import { useState } from 'react';
import { Mail, Search, Eye, Trash2, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

type Message = {
    id: string;
    name: string;
    email: string;
    subject: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
};

interface MessagesManagerProps {
    initialMessages: Message[];
}

export default function MessagesManager({ initialMessages }: MessagesManagerProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredMessages = messages.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true }),
            });
            if (response.ok) {
                setMessages(messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
                toast.success('Marqué comme lu');
            }
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setMessages(messages.filter((m) => m.id !== id));
                toast.success('Message supprimé');
                setViewingMessage(null);
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-dark mb-1">Messages de contact</h1>
                <p className="text-sm text-text-light">Gérez les demandes reçues via le formulaire du site.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher par nom, email ou sujet..."
                        className="w-full pl-10 pr-4 py-2 bg-cream border border-gray-200 rounded-lg text-sm outline-none focus:border-lime transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                        <Mail size={48} className="mx-auto text-text-light/30 mb-4" />
                        <p className="text-text-light font-medium">Aucun message trouvé</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-cream/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Expéditeur</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Sujet</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase">Statut</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-light uppercase text-right w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMessages.map((msg) => (
                                    <tr key={msg.id} className={`hover:bg-cream/30 transition-colors ${!msg.isRead ? 'bg-blue-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-dark text-sm">{msg.name}</p>
                                            <p className="text-xs text-text-light">{msg.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-dark truncate max-w-xs">{msg.subject}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-light">{formatDate(msg.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            {msg.isRead ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Lu</span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Non lu</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!msg.isRead && (
                                                    <button onClick={() => markAsRead(msg.id)} className="p-2 text-text-light hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Marquer comme lu">
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => setViewingMessage(msg)} className="p-2 text-text-light hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Voir le message">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => deleteMessage(msg.id)} className="p-2 text-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL : Voir le message */}
            {viewingMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-dark">Message de {viewingMessage.name}</h2>
                            <button onClick={() => setViewingMessage(null)} className="p-2 hover:bg-cream rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-text-light uppercase font-semibold mb-1">Email</p>
                                    <p className="text-dark font-medium">{viewingMessage.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-light uppercase font-semibold mb-1">Date</p>
                                    <p className="text-dark font-medium">{formatDate(viewingMessage.createdAt)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-text-light uppercase font-semibold mb-1">Sujet</p>
                                <p className="text-dark font-medium text-lg">{viewingMessage.subject}</p>
                            </div>
                            <div className="bg-cream/50 p-4 rounded-xl border border-gray-200">
                                <p className="text-sm text-dark whitespace-pre-wrap leading-relaxed">{viewingMessage.content}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <a
                                href={`mailto:${viewingMessage.email}?subject=Re: ${encodeURIComponent(viewingMessage.subject)}`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                            >
                                <ExternalLink size={16} />
                                Répondre par email
                            </a>
                            <button
                                onClick={() => deleteMessage(viewingMessage.id)}
                                disabled={isDeleting}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}