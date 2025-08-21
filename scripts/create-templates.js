// Script pour créer des templates d'exemple
const axios = require('axios');

const API_URL = 'http://localhost:1337/api';

const sampleTemplates = [
    {
        name: "Restaurant Moderne",
        description: "Template élégant pour restaurant gastronomique avec réservation en ligne et menu interactif",
        category: "restaurant",
        framework: "Bootstrap 5",
        difficulty: "Facile",
        isFree: true,
        isFeatured: true,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: true,
        hasBlog: false,
        hasEcommerce: false,
        demoUrl: "https://themes.getbootstrap.com/preview/?theme_id=52938",
        license: "MIT",
        rating: 4.8,
        ratingCount: 34,
        downloadCount: 156
    },
    {
        name: "Boulangerie Artisanale",
        description: "Template chaleureux pour boulangerie avec catalogue produits et commande en ligne",
        category: "boulangerie",
        framework: "HTML5/CSS3",
        difficulty: "Facile",
        isFree: true,
        isFeatured: false,
        responsive: true,
        seoOptimized: true,
        hasBooking: false,
        hasGallery: true,
        hasBlog: true,
        hasEcommerce: true,
        license: "MIT",
        rating: 4.6,
        ratingCount: 28,
        downloadCount: 89
    },
    {
        name: "Boutique Mode Premium",
        description: "Template moderne pour boutique de vêtements avec e-commerce complet et paiement sécurisé",
        category: "commerce",
        framework: "React",
        difficulty: "Intermédiaire",
        isFree: false,
        price: 49,
        isFeatured: true,
        responsive: true,
        seoOptimized: true,
        hasBooking: false,
        hasGallery: true,
        hasBlog: true,
        hasEcommerce: true,
        demoUrl: "https://preview.themeforest.net/item/fashme-fashion-ecommerce-html-template/full_screen_preview/25145349",
        license: "Commercial",
        rating: 4.9,
        ratingCount: 67,
        downloadCount: 234
    },
    {
        name: "Atelier Artisanat",
        description: "Template authentique pour artisan créateur avec portfolio et boutique en ligne",
        category: "artisanat",
        framework: "Vue.js",
        difficulty: "Intermédiaire",
        isFree: true,
        isFeatured: false,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: true,
        hasBlog: true,
        hasEcommerce: true,
        license: "Creative Commons",
        rating: 4.7,
        ratingCount: 19,
        downloadCount: 67
    },
    {
        name: "Salon de Beauté Élite",
        description: "Template luxueux pour salon de beauté avec système de réservation et galerie photos",
        category: "beaute",
        framework: "Bootstrap 5",
        difficulty: "Facile",
        isFree: false,
        price: 29,
        isFeatured: true,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: true,
        hasBlog: false,
        hasEcommerce: false,
        demoUrl: "https://preview.themeforest.net/item/beauty-salon-responsive-html-template/full_screen_preview/19334631",
        license: "Commercial",
        rating: 4.8,
        ratingCount: 45,
        downloadCount: 123
    },
    {
        name: "Garage Auto Pro",
        description: "Template professionnel pour garage automobile avec prise de rendez-vous et devis en ligne",
        category: "automobile",
        framework: "Angular",
        difficulty: "Avancé",
        isFree: true,
        isFeatured: false,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: false,
        hasBlog: true,
        hasEcommerce: false,
        license: "GPL",
        rating: 4.5,
        ratingCount: 12,
        downloadCount: 34
    },
    {
        name: "Cabinet Médical",
        description: "Template médical avec prise de rendez-vous, présentation de l'équipe et informations pratiques",
        category: "sante",
        framework: "WordPress",
        difficulty: "Facile",
        isFree: false,
        price: 39,
        isFeatured: false,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: false,
        hasBlog: true,
        hasEcommerce: false,
        license: "GPL",
        rating: 4.6,
        ratingCount: 23,
        downloadCount: 78
    },
    {
        name: "Agence Immobilière",
        description: "Template complet pour agence immobilière avec recherche avancée et visites virtuelles",
        category: "immobilier",
        framework: "Next.js",
        difficulty: "Avancé",
        isFree: false,
        price: 79,
        isFeatured: true,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: true,
        hasBlog: true,
        hasEcommerce: false,
        demoUrl: "https://preview.themeforest.net/item/realtor-real-estate-html-template/full_screen_preview/22896398",
        license: "Commercial",
        rating: 4.9,
        ratingCount: 89,
        downloadCount: 345
    },
    {
        name: "École de Formation",
        description: "Template éducatif avec cours en ligne, inscriptions et espace étudiant",
        category: "education",
        framework: "Laravel",
        difficulty: "Avancé",
        isFree: true,
        isFeatured: false,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: false,
        hasBlog: true,
        hasEcommerce: true,
        license: "MIT",
        rating: 4.4,
        ratingCount: 16,
        downloadCount: 45
    },
    {
        name: "Service Plomberie",
        description: "Template simple et efficace pour artisan plombier avec contact et urgences",
        category: "service",
        framework: "HTML5/CSS3",
        difficulty: "Facile",
        isFree: true,
        isFeatured: false,
        responsive: true,
        seoOptimized: true,
        hasBooking: true,
        hasGallery: false,
        hasBlog: false,
        hasEcommerce: false,
        license: "MIT",
        rating: 4.3,
        ratingCount: 8,
        downloadCount: 23
    }
];

async function createSampleTemplates() {
    console.log('Création des templates d\'exemple...');
    
    for (const template of sampleTemplates) {
        try {
            const response = await axios.post(`${API_URL}/templates`, {
                data: template
            });
            console.log(`✅ Template créé: ${template.name}`);
        } catch (error) {
            console.error(`❌ Erreur pour ${template.name}:`, error.response?.data || error.message);
        }
    }
    
    console.log('Terminé!');
}

// Exporter pour utilisation
module.exports = { createSampleTemplates, sampleTemplates };

// Si exécuté directement
if (require.main === module) {
    createSampleTemplates();
}
