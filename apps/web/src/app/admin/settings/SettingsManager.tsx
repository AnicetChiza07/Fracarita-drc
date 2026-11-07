'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Globe, Mail, Phone, MapPin, Link as LinkIcon, User, Lock, Eye, EyeOff, ShieldCheck, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { JsonValue } from '@prisma/client/runtime/library';

type SocialLinks = {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
};

type Settings = {
    id: string;
    siteName: string;
    siteDescription: string | null;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    // ✅ Accepte JsonValue de Prisma (string | number | boolean | JsonObject | JsonArray | null)
    socialLinks: JsonValue;
};

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

interface SettingsManagerProps {
    initialSettings: Settings;
    currentUser: User;
}

export default function SettingsManager({ initialSettings, currentUser }: SettingsManagerProps) {
    const router = useRouter();
    // ✅ Cast sécurisé de JsonValue vers SocialLinks
    const initialSocial = ((initialSettings.socialLinks as SocialLinks) || {}) as SocialLinks;

    // États pour la visibilité des mots de passe
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // État des paramètres du site
    const [siteData, setSiteData] = useState({
        siteName: initialSettings.siteName,
        siteDescription: initialSettings.siteDescription || '',
        contactEmail: initialSettings.contactEmail,
        contactPhone: initialSettings.contactPhone,
        contactAddress: initialSettings.contactAddress,
        facebook: initialSocial.facebook || '',
        twitter: initialSocial.twitter || '',
        instagram: initialSocial.instagram || '',
        linkedin: initialSocial.linkedin || '',
    });
    const [isSavingSite, setIsSavingSite] = useState(false);

    // État du profil utilisateur
    const [profileData, setProfileData] = useState({
        name: currentUser.name,
        email: currentUser.email,
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // État du mot de passe
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Sauvegarder les paramètres du site
    const handleSaveSite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSite(true);
        try {
            const payload = {
                siteName: siteData.siteName,
                siteDescription: siteData.siteDescription || null,
                contactEmail: siteData.contactEmail,
                contactPhone: siteData.contactPhone,
                contactAddress: siteData.contactAddress,
                socialLinks: {
                    facebook: siteData.facebook,
                    twitter: siteData.twitter,
                    instagram: siteData.instagram,
                    linkedin: siteData.linkedin,
                },
            };

            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la sauvegarde');

            toast.success('Paramètres du site sauvegardés avec succès');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            toast.error(errorMessage);
        } finally {
            setIsSavingSite(false);
        }
    };

    // Sauvegarder le profil
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileData.name.trim()) { toast.error('Le nom est obligatoire'); return; }
        if (!profileData.email.trim()) { toast.error('L\'email est obligatoire'); return; }

        setIsSavingProfile(true);
        try {
            const response = await fetch('/api/settings/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors de la sauvegarde');

            toast.success('Profil mis à jour avec succès');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            toast.error(errorMessage);
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Changer le mot de passe + DÉCONNEXION AUTOMATIQUE
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordData.currentPassword) { toast.error('L\'ancien mot de passe est obligatoire'); return; }
        if (!passwordData.newPassword) { toast.error('Le nouveau mot de passe est obligatoire'); return; }
        if (passwordData.newPassword.length < 8) { toast.error('Le mot de passe doit contenir au moins 8 caractères'); return; }
        if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Les mots de passe ne correspondent pas'); return; }

        setIsChangingPassword(true);
        try {
            const response = await fetch('/api/settings/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur lors du changement de mot de passe');

            toast.success('Mot de passe modifié avec succès. Vous allez être redirigé vers la page de connexion...');

            await fetch('/api/auth/logout', { method: 'POST' });

            setTimeout(() => {
                router.push('/admin/login');
            }, 2000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            toast.error(errorMessage);
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Fonction utilitaire pour calculer la force du mot de passe
    const getPasswordStrength = (password: string): { label: string; color: string; width: string } => {
        if (!password) return { label: '', color: '', width: '0%' };
        if (password.length < 8) return { label: 'Faible', color: 'bg-red-500', width: '33%' };
        if (password.length < 12) return { label: 'Moyen', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Fort', color: 'bg-green-500', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(passwordData.newPassword);

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div>
                <h1 className="text-2xl font-bold text-dark mb-1">Paramètres</h1>
                <p className="text-sm text-text-light">Configurez les informations du site et votre compte.</p>
            </div>

            {/* Section 1 : Informations du site */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-cream/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime/20 rounded-lg flex items-center justify-center">
                            <Globe size={20} className="text-lime-dark" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-dark">Informations du site</h2>
                            <p className="text-xs text-text-light">Ces informations apparaîtront sur le site public</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSaveSite} className="p-6 space-y-6">
                    <div>
                        <label className="text-xs font-semibold text-dark uppercase mb-2 block">Nom du site *</label>
                        <input
                            type="text"
                            value={siteData.siteName}
                            onChange={(e) => setSiteData({ ...siteData, siteName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-dark uppercase mb-2 block">Description du site</label>
                        <textarea
                            value={siteData.siteDescription}
                            onChange={(e) => setSiteData({ ...siteData, siteDescription: e.target.value })}
                            rows={3}
                            placeholder="Une courte description de votre organisation..."
                            className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block flex items-center gap-2">
                                <Mail size={14} /> Email de contact *
                            </label>
                            <input
                                type="email"
                                value={siteData.contactEmail}
                                onChange={(e) => setSiteData({ ...siteData, contactEmail: e.target.value })}
                                className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block flex items-center gap-2">
                                <Phone size={14} /> Téléphone *
                            </label>
                            <input
                                type="tel"
                                value={siteData.contactPhone}
                                onChange={(e) => setSiteData({ ...siteData, contactPhone: e.target.value })}
                                className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block flex items-center gap-2">
                                <MapPin size={14} /> Adresse *
                            </label>
                            <input
                                type="text"
                                value={siteData.contactAddress}
                                onChange={(e) => setSiteData({ ...siteData, contactAddress: e.target.value })}
                                className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-dark uppercase mb-3 block flex items-center gap-2">
                            <LinkIcon size={14} /> Réseaux sociaux
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="url" value={siteData.facebook} onChange={(e) => setSiteData({ ...siteData, facebook: e.target.value })} placeholder="Facebook" className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" />
                            <input type="url" value={siteData.twitter} onChange={(e) => setSiteData({ ...siteData, twitter: e.target.value })} placeholder="Twitter / X" className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" />
                            <input type="url" value={siteData.instagram} onChange={(e) => setSiteData({ ...siteData, instagram: e.target.value })} placeholder="Instagram" className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" />
                            <input type="url" value={siteData.linkedin} onChange={(e) => setSiteData({ ...siteData, linkedin: e.target.value })} placeholder="LinkedIn" className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button type="submit" disabled={isSavingSite} className="inline-flex items-center gap-2 px-6 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 transition-colors">
                            {isSavingSite && <Loader2 size={16} className="animate-spin" />}
                            <Save size={16} />
                            Sauvegarder les paramètres
                        </button>
                    </div>
                </form>
            </div>

            {/* Section 2 : Mon profil */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-cream/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime/20 rounded-lg flex items-center justify-center">
                            <User size={20} className="text-lime-dark" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-dark">Mon profil</h2>
                            <p className="text-xs text-text-light">Modifiez vos informations personnelles</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block">Nom complet *</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block">Email *</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button type="submit" disabled={isSavingProfile} className="inline-flex items-center gap-2 px-6 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 transition-colors">
                            {isSavingProfile && <Loader2 size={16} className="animate-spin" />}
                            <Save size={16} />
                            Mettre à jour le profil
                        </button>
                    </div>
                </form>
            </div>

            {/* Section 3 : Changer le mot de passe (3 COLONNES SUR ORDINATEUR) */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-cream/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime/20 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={20} className="text-lime-dark" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-dark">Sécurité</h2>
                            <p className="text-xs text-text-light">Modifiez votre mot de passe. Vous serez déconnecté après le changement.</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                    {/* ✅ 3 inputs sur la même ligne avec labels distinctifs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Mot de passe actuel */}
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block flex items-center gap-2">
                                <KeyRound size={14} className="text-text-light/60" />
                                <span>Mot de passe actuel</span>
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/50" />
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    placeholder="Actuel"
                                    className="w-full pl-11 pr-12 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-light hover:text-dark transition-colors"
                                    tabIndex={-1}
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Nouveau mot de passe */}
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block flex items-center gap-2">
                                <RefreshCw size={14} className="text-text-light/60" />
                                <span>Nouveau mot de passe</span>
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/50" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Nouveau"
                                    className="w-full pl-11 pr-12 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-light hover:text-dark transition-colors"
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Indicateur de force */}
                            {passwordData.newPassword && (
                                <div className="mt-2">
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: passwordStrength.width }}
                                        />
                                    </div>
                                    <p className={`text-xs mt-1 font-medium ${
                                        passwordStrength.label === 'Faible' ? 'text-red-600' :
                                        passwordStrength.label === 'Moyen' ? 'text-yellow-600' :
                                        'text-green-600'
                                    }`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirmation */}
                        <div>
                            <label className="text-xs font-semibold text-dark uppercase mb-2 block flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-text-light/60" />
                                <span>Confirmer</span>
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/50" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Confirmer"
                                    className="w-full pl-11 pr-12 py-2.5 bg-cream border border-gray-200 rounded-xl outline-none focus:border-lime transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-light hover:text-dark transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Indicateur de correspondance */}
                            {passwordData.confirmPassword && (
                                <p className={`text-xs mt-1 font-medium ${
                                    passwordData.confirmPassword === passwordData.newPassword 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                }`}>
                                    {passwordData.confirmPassword === passwordData.newPassword 
                                        ? '✓ Correspond' 
                                        : '✗ Différent'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Alerte de déconnexion */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <ShieldCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">
                            Pour des raisons de sécurité, vous serez automatiquement déconnecté après le changement de mot de passe et devrez vous reconnecter avec vos nouveaux identifiants.
                        </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button type="submit" disabled={isChangingPassword} className="inline-flex items-center gap-2 px-6 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-dark disabled:opacity-50 transition-colors">
                            {isChangingPassword && <Loader2 size={16} className="animate-spin" />}
                            <Lock size={16} />
                            Changer le mot de passe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}