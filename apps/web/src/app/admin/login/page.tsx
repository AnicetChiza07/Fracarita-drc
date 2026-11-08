'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Une erreur est survenue');
                setIsLoading(false);
                return;
            }

            setSuccess('Connexion réussie ! Redirection...');

            // Rechargement complet : le cookie est envoyé et le cache de navigation est ignoré
            setTimeout(() => {
                window.location.href = '/admin/dashboard';
            }, 800);
        } catch (err) {
            console.error(err);
            setError('Erreur de connexion au serveur');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-screen bg-dark overflow-hidden flex items-center justify-center py-12 px-4">

            {/* Motif de grille subtil */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(200, 224, 71, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 224, 71, 0.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Glows décoratifs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Card de connexion */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/logo-clair.png"
                            alt="Logo Fracarita"
                            width={150}
                            height={0}
                            className="h-12 sm:h-14 w-auto object-contain"
                        />
                    </div>

                    {/* En-tête */}
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                            Espace Administrateur
                        </h1>
                        <p className="font-sans text-sm text-white/60">
                            Connectez-vous pour gérer la plateforme
                        </p>
                    </div>

                    {/* Messages d'erreur / succès */}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl font-sans text-sm mb-6">
                            <AlertCircle size={18} className="flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-3 bg-lime/10 border border-lime/30 text-lime px-4 py-3 rounded-xl font-sans text-sm mb-6">
                            <CheckCircle size={18} className="flex-shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-sans text-xs font-semibold text-white/80 uppercase tracking-wider">
                                Adresse email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@fracarita-rdc.org"
                                    required
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl font-sans text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-lime focus:bg-white/10 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="font-sans text-xs font-semibold text-white/80 uppercase tracking-wider">
                                    Mot de passe
                                </label>
                                <button type="button" className="font-sans text-xs text-lime hover:text-white transition-colors duration-300">
                                    Mot de passe oublié ?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl font-sans text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-lime focus:bg-white/10 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-lime transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-lime text-dark py-3.5 rounded-xl font-sans font-semibold text-sm transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="font-sans text-xs text-white/40">
                            Connexion sécurisée • Données chiffrées
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="font-sans text-xs text-white/40">
                        Accès réservé aux administrateurs autorisés
                    </p>
                </div>
            </div>
        </div>
    );
}