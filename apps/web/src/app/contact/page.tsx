'use client';

import { useState } from 'react';
import { User, Mail, Phone, Tag, Pencil, ArrowRight, CheckCircle, MapPin, AlertCircle } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSuccess(false);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            content: formData.get('content'),
        };

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Échec de l\'envoi');
            }

            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
            
            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-white">
            {/* 1. Hero Réutilisable */}
            <PageHero
                titleBefore="Une question ?"
                highlight="Écrivez-nous"
                titleAfter="."
                description={`Notre équipe est à votre écoute pour répondre à vos questions, discuter de partenariats ou vous accompagner dans vos démarches.`}
                breadcrumbCurrent="Contact"
                bgImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
            />

            {/* 2. Section Formulaire & Infos */}
            <section className="py-20 lg:py-32 bg-white relative">
                <div className="container relative z-10">
                    
                    {/* Header en 2 colonnes */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end mb-12 lg:mb-16">
                        <div>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream border border-lime/30 text-text text-sm font-medium mb-5">
                                <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                                Formulaire de contact
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dark leading-tight">
                                Envoyez-nous un{' '}
                                <span className="text-lime-dark italic relative inline-block">
                                    message
                                    <span className="absolute bottom-1 left-0 w-full h-2 bg-lime/25 -z-10 rounded-sm"></span>
                                </span>
                                .
                            </h2>
                        </div>

                        <div className="lg:text-right">
                            <p className="text-base sm:text-lg text-text-light leading-relaxed font-sans max-w-lg lg:ml-auto">
                                {`Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais. Chaque message compte pour nous.`}
                            </p>
                        </div>
                    </div>

                    {/* Card Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] rounded-3xl overflow-hidden border border-gray-200">
                        
                        {/* Côté Formulaire */}
                        <div className="p-8 sm:p-10 lg:p-14 bg-white">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                
                                {/* Nom complet */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="font-sans text-sm font-semibold text-dark flex items-center gap-1">
                                        Nom complet <span className="text-lime-dark">*</span>
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light transition-colors peer-focus:text-lime-dark" />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="Votre nom et prénom"
                                            className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-gray-200 rounded-xl font-sans text-sm text-dark placeholder:text-text-light/50 outline-none transition-all duration-300 hover:border-lime/50 focus:border-lime focus:ring-4 focus:ring-lime/10"
                                        />
                                    </div>
                                </div>

                                {/* Email & Téléphone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="font-sans text-sm font-semibold text-dark flex items-center gap-1">
                                            Email <span className="text-lime-dark">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light transition-colors peer-focus:text-lime-dark" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="votre@email.com"
                                                className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-gray-200 rounded-xl font-sans text-sm text-dark placeholder:text-text-light/50 outline-none transition-all duration-300 hover:border-lime/50 focus:border-lime focus:ring-4 focus:ring-lime/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="phone" className="font-sans text-sm font-semibold text-dark">
                                            Téléphone
                                        </label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light transition-colors peer-focus:text-lime-dark" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                placeholder="+243 ..."
                                                className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-gray-200 rounded-xl font-sans text-sm text-dark placeholder:text-text-light/50 outline-none transition-all duration-300 hover:border-lime/50 focus:border-lime focus:ring-4 focus:ring-lime/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sujet */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="subject" className="font-sans text-sm font-semibold text-dark flex items-center gap-1">
                                        Sujet <span className="text-lime-dark">*</span>
                                    </label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light transition-colors peer-focus:text-lime-dark" />
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            placeholder="De quoi souhaitez-vous nous parler ?"
                                            className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-gray-200 rounded-xl font-sans text-sm text-dark placeholder:text-text-light/50 outline-none transition-all duration-300 hover:border-lime/50 focus:border-lime focus:ring-4 focus:ring-lime/10"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="content" className="font-sans text-sm font-semibold text-dark flex items-center gap-1">
                                        Message <span className="text-lime-dark">*</span>
                                    </label>
                                    <div className="relative">
                                        <Pencil size={16} className="absolute left-3 top-4 text-text-light transition-colors peer-focus:text-lime-dark" />
                                        <textarea
                                            id="content"
                                            name="content"
                                            required
                                            rows={4}
                                            placeholder="Décrivez votre demande en détail..."
                                            className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-gray-200 rounded-xl font-sans text-sm text-dark placeholder:text-text-light/50 outline-none transition-all duration-300 hover:border-lime/50 focus:border-lime focus:ring-4 focus:ring-lime/10 resize-y min-h-[120px]"
                                        />
                                    </div>
                                </div>

                                {/* Messages d'état */}
                                {isSuccess && (
                                    <div className="flex items-center gap-3 bg-lime/10 border border-lime/30 text-lime-dark px-6 py-3.5 rounded-xl font-sans font-semibold text-sm animate-fade-in-up">
                                        <CheckCircle size={18} className="text-lime-dark" />
                                        <span>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-6 py-3.5 rounded-xl font-sans font-semibold text-sm animate-fade-in-up">
                                        <AlertCircle size={18} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Bouton d'envoi */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 inline-flex items-center justify-center gap-3 bg-dark text-white px-8 py-3.5 rounded-full font-sans font-semibold text-sm border-none cursor-pointer transition-all duration-300 hover:bg-lime hover:text-dark hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 group w-full sm:w-auto"
                                >
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                                    {!isSubmitting && (
                                        <span className="w-8 h-8 bg-lime rounded-full flex items-center justify-center group-hover:bg-dark transition-all duration-300">
                                            <ArrowRight size={14} className="text-dark group-hover:text-lime transition-colors duration-300" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Côté Informations (Dark) */}
                        <div className="bg-dark p-8 sm:p-10 lg:p-14 text-white relative overflow-hidden flex flex-col justify-center">
                            {/* ✅ Pattern de fond avec opacité réduite (0.02 au lieu de 0.04) */}
                            <div 
                                className="absolute inset-0 opacity-100 pointer-events-none" 
                                style={{ 
                                    backgroundImage: 'linear-gradient(rgba(200, 224, 71, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 224, 71, 0.02) 1px, transparent 1px)', 
                                    backgroundSize: '40px 40px' 
                                }} 
                            />
                            
                            {/* Carrés flottants décoratifs */}
                            <div className="absolute top-10 right-10 w-15 h-15 border border-lime/15 rounded-lg animate-float-1 pointer-events-none" />
                            <div className="absolute top-30 right-30 w-10 h-10 bg-lime/6 rounded-lg animate-float-2 pointer-events-none" />
                            <div className="absolute bottom-20 left-10 w-12 h-12 border border-lime/15 rounded-lg animate-float-3 pointer-events-none" />
                            <div className="absolute bottom-40 right-15 w-8 h-8 bg-lime/8 rounded-lg animate-float-4 pointer-events-none" />
                            <div className="absolute top-1/2 left-8 w-6 h-6 animate-float-5 pointer-events-none" />

                            {/* Glows */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime/12 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-lime/6 rounded-full blur-[80px] pointer-events-none" />

                            {/* Contenu */}
                            <div className="relative z-10">
                                <div className="mb-10">
                                    <div className="text-xs font-semibold text-lime uppercase tracking-[0.15em] mb-4 flex items-center gap-3 font-sans">
                                        <div className="w-5 h-0.5 bg-lime"></div>
                                        Informations
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                                        {`Besoin de nous joindre directement ?`}
                                    </h3>
                                </div>

                                <ul className="flex flex-col gap-8">
                                    <li className="flex items-start gap-4 group cursor-pointer transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-11 h-11 bg-lime/10 border border-lime/20 rounded-full flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime group-hover:-rotate-6">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[0.7rem] text-white/50 uppercase tracking-[0.1em] font-medium mb-1 font-sans">Adresse</div>
                                            <div className="font-sans text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-lime leading-relaxed">
                                                Nord-kivu, Goma<br />Quartier Eringeti, N°35
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-4 group cursor-pointer transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-11 h-11 bg-lime/10 border border-lime/20 rounded-full flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime group-hover:-rotate-6">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[0.7rem] text-white/50 uppercase tracking-[0.1em] font-medium mb-1 font-sans">Email</div>
                                            <a href="mailto:contact@fracarita-rdc.org" className="font-sans text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-lime">
                                                contact@fracarita-rdc.org
                                            </a>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-4 group cursor-pointer transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-11 h-11 bg-lime/10 border border-lime/20 rounded-full flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime group-hover:-rotate-6">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[0.7rem] text-white/50 uppercase tracking-[0.1em] font-medium mb-1 font-sans">Téléphone</div>
                                            <a href="tel:+243999458216" className="font-sans text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-lime">
                                                +243 999 458 216
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}