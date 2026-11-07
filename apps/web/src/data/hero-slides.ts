export interface HeroSlide {
    id: number;
    badge: string;
    title: {
        before: string;
        highlight: string;
        after: string;
    };
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}

export interface Rubrique {
    title: string;
    description: string;
    link: string;
}

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        badge: 'Organisation Humanitaire',
        title: {
        before: 'Ensemble, construisons un avenir',
        highlight: 'meilleur',
        after: 'pour tous.',
    },
        description:
            "De l'éducation à la santé communautaire, nous accompagnons les familles vulnérables de la RDC vers un avenir plus digne.",
        buttonText: 'Commencer',
        buttonLink: '/actions',
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&q=80',
    },
    {
        id: 2,
        badge: 'Éducation pour Tous',
        title: {
            before: 'Chaque enfant mérite une',
            highlight: 'éducation',
            after: 'de qualité.',
        },
        description:
            "Nous construisons des écoles et formons des enseignants dans les zones rurales pour offrir un avenir brillant à la prochaine génération.",
        buttonText: 'Nos Projets',
        buttonLink: '/actions',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80',
    },
    {
        id: 3,
        badge: 'Santé Communautaire',
        title: {
            before: 'La santé est un',
            highlight: 'droit',
            after: ', pas un privilège.',
        },
        description:
            "Nos caravanes médicales mobiles apportent des soins gratuits dans les zones les plus isolées de la République Démocratique du Congo.",
        buttonText: 'En savoir plus',
        buttonLink: '/actions',
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&q=80',
    },
];

export const rubriques: Rubrique[] = [
    {
        title: 'Éducation',
        description: 'Écoles, bourses & formation',
        link: '/actions#education',
    },
    {
        title: 'Santé',
        description: 'Soins & prévention',
        link: '/actions#sante',
    },
    {
        title: 'Organisation',
        description: 'Notre structure & équipe',
        link: '/a-propos',
    },
];