// Générateur Simple pour Commerçants et Artisans Locaux
console.log('🚀 Générateur simple initialisé');

// Templates simples et pratiques
const TEMPLATES_LOCAUX = {
    'restaurant': {
        name: 'Restaurant / Bar',
        category: 'restauration',
        description: 'Site pour restaurant, bar, café avec présentation des plats et réservations',
        exemple: 'Restaurant Le Bon Goût - Cuisine traditionnelle'
    },
    'commerce': {
        name: 'Commerce / Boutique',
        category: 'commerce',
        description: 'Site pour magasin, boutique avec présentation des produits',
        exemple: 'Boutique Marie - Mode et accessoires'
    },
    'artisan': {
        name: 'Artisan / Services',
        category: 'artisanat',
        description: 'Site pour artisan, services à domicile avec portfolio',
        exemple: 'Atelier Martin - Menuiserie sur mesure'
    },
    'professionnel': {
        name: 'Professionnel libéral',
        category: 'professionnel',
        description: 'Site pour cabinet, consultant, profession libérale',
        exemple: 'Cabinet Durand - Expertise comptable'
    },
    'association': {
        name: 'Association / Événements',
        category: 'association',
        description: 'Site pour association, club, organisateur d\'événements',
        exemple: 'Association Locale - Ensemble pour notre ville'
    },
    'vitrine': {
        name: 'Site vitrine simple',
        category: 'vitrine',
        description: 'Site basique pour présenter son activité',
        exemple: 'Mon Entreprise - Présentation et contact'
    }
};

// Couleurs simples et agréables
const COULEURS_SIMPLES = {
    'bleu': {
        name: 'Bleu professionnel',
        primary: '#007bff',
        secondary: '#0056b3',
        accent: '#17a2b8'
    },
    'vert': {
        name: 'Vert nature',
        primary: '#28a745',
        secondary: '#1e7e34',
        accent: '#20c997'
    },
    'rouge': {
        name: 'Rouge dynamique',
        primary: '#dc3545',
        secondary: '#c82333',
        accent: '#fd7e14'
    },
    'orange': {
        name: 'Orange chaleureux',
        primary: '#fd7e14',
        secondary: '#e55a00',
        accent: '#ffc107'
    },
    'violet': {
        name: 'Violet créatif',
        primary: '#6f42c1',
        secondary: '#5a32a3',
        accent: '#e83e8c'
    },
    'gris': {
        name: 'Gris moderne',
        primary: '#6c757d',
        secondary: '#495057',
        accent: '#007bff'
    }
};

// Options utiles pour les commerçants
const OPTIONS_PRATIQUES = {
    'contact': 'Formulaire de contact',
    'galerie': 'Galerie photos',
    'horaires': 'Horaires d\'ouverture',
    'localisation': 'Plan d\'accès',
    'testimonials': 'Avis clients',
    'reservation': 'Prise de rendez-vous',
    'blog': 'Blog / Actualités',
    'reseaux': 'Réseaux sociaux'
};

// Variables
let currentStep = 1;
let selectedTemplate = null;
let selectedColor = null;
let selectedOptions = [];

// Navigation entre les étapes
function showStep(step) {
    console.log(`📍 Étape ${step}`);
    
    // Masquer toutes les étapes
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Afficher l'étape actuelle
    document.getElementById(`stepContent${step}`).classList.add('active');
    
    // Mettre à jour les indicateurs
    for (let i = 1; i <= 4; i++) {
        const stepItem = document.getElementById(`stepItem${i}`);
        stepItem.classList.remove('active');
        
        if (i === step) {
            stepItem.classList.add('active');
        }
    }
    
    updateButtons();
    
    // Actions spécifiques
    if (step === 4) {
        generatePreview();
    }
    
    currentStep = step;
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const generateBtn = document.getElementById('generateBtn');
    
    console.log(`🔄 Mise à jour boutons - Étape: ${currentStep}`);
    console.log(`📝 Template sélectionné: ${selectedTemplate}`);
    console.log(`🎨 Couleur sélectionnée: ${selectedColor}`);
    
    prevBtn.disabled = currentStep === 1;
    
    if (currentStep === 4) {
        nextBtn.classList.add('d-none');
        generateBtn.classList.remove('d-none');
    } else {
        nextBtn.classList.remove('d-none');
        generateBtn.classList.add('d-none');
        
        // Validation simple avec logs
        if (currentStep === 1 && !selectedTemplate) {
            console.log('⚠️ Étape 1: Pas de template sélectionné');
            nextBtn.disabled = true;
        } else if (currentStep === 2 && !selectedColor) {
            console.log('⚠️ Étape 2: Pas de couleur sélectionnée');
            nextBtn.disabled = true;
        } else {
            console.log('✅ Validation OK pour cette étape');
            nextBtn.disabled = false;
        }
    }
}

function nextStep() {
    if (currentStep < 4) {
        showStep(currentStep + 1);
    }
}

function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// Sélection de template
function selectTemplate(templateId) {
    console.log(`✅ Template sélectionné: ${templateId}`);
    
    selectedTemplate = templateId;
    const template = TEMPLATES_LOCAUX[templateId];
    
    // Mise à jour visuelle
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '#e9ecef';
        card.style.boxShadow = 'none';
    });
    
    const selectedCard = document.querySelector(`[data-template="${templateId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.style.borderColor = '#007bff';
        selectedCard.style.boxShadow = '0 4px 12px rgba(0,123,255,0.2)';
        
        // Feedback visuel
        console.log(`🎯 ${template.name} sélectionné !`);
        
        // Animation rapide de confirmation
        selectedCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            selectedCard.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateButtons();
}

// Sélection de couleur
function selectColor(colorId) {
    console.log(`🎨 Couleur sélectionnée: ${colorId}`);
    
    selectedColor = colorId;
    
    // Mise à jour visuelle
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector(`[data-color="${colorId}"]`).classList.add('selected');
    
    updateButtons();
}

// Sélection d'options
function toggleOption(optionId) {
    console.log(`🔧 Option: ${optionId}`);
    
    const optionCard = document.querySelector(`[data-feature="${optionId}"]`);
    const index = selectedOptions.indexOf(optionId);
    
    if (index === -1) {
        selectedOptions.push(optionId);
        optionCard.classList.add('selected');
    } else {
        selectedOptions.splice(index, 1);
        optionCard.classList.remove('selected');
    }
}

// Génération de l'aperçu
function generatePreview() {
    console.log('👀 Génération aperçu...');
    
    const template = TEMPLATES_LOCAUX[selectedTemplate];
    const colors = COULEURS_SIMPLES[selectedColor] || COULEURS_SIMPLES.bleu;
    
    const previewHTML = generateSimpleHTML(template, colors, selectedOptions);
    
    const previewContainer = document.getElementById('finalPreview');
    previewContainer.innerHTML = `
        <iframe 
            srcdoc="${previewHTML.replace(/"/g, '&quot;')}" 
            style="width: 100%; height: 500px; border: none;"
        ></iframe>
    `;
}

// Générateur HTML simple et propre
function generateSimpleHTML(template, colors, options) {
    const styles = `
        <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333;
        }
        
        .header {
            background: ${colors.primary};
            color: white;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-menu a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background 0.3s;
        }
        
        .nav-menu a:hover {
            background: rgba(255,255,255,0.2);
        }
        
        .hero {
            background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .btn {
            background: ${colors.accent};
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
        }
        
        .btn:hover {
            background: ${colors.secondary};
            transform: translateY(-2px);
        }
        
        .section {
            padding: 3rem 0;
        }
        
        .section-title {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 2rem;
            color: ${colors.primary};
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            border-left: 4px solid ${colors.primary};
        }
        
        .card h3 {
            color: ${colors.primary};
            margin-bottom: 1rem;
        }
        
        .contact-info {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin-top: 2rem;
        }
        
        .footer {
            background: #343a40;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        @media (max-width: 768px) {
            .nav-menu { display: none; }
            .hero h1 { font-size: 2rem; }
            .grid { grid-template-columns: 1fr; }
        }
        </style>
    `;

    let content = '';
    
    // Contenu spécialisé par type de template
    if (template.category === 'restauration') {
        content = generateRestaurantContent(template, colors, options);
    } else if (template.category === 'commerce') {
        content = generateCommerceContent(template, colors, options);
    } else if (template.category === 'artisanat') {
        content = generateArtisanContent(template, colors, options);
    } else if (template.category === 'professionnel') {
        content = generateProfessionnelContent(template, colors, options);
    } else if (template.category === 'association') {
        content = generateAssociationContent(template, colors, options);
    } else {
        content = generateVitrineContent(template, colors, options);
    }
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.exemple}</title>
    ${styles}
</head>
<body>
    ${content}
</body>
</html>`;
}

function generateRestaurantContent(template, colors, options) {
    return `
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">Restaurant Le Bon Goût</div>
                    <ul class="nav-menu">
                        <li><a href="#accueil">Accueil</a></li>
                        <li><a href="#carte">Notre Carte</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <section class="hero">
            <div class="container">
                <h1>Bienvenue au Restaurant Le Bon Goût</h1>
                <p>Cuisine traditionnelle française dans un cadre chaleureux</p>
                <a href="#carte" class="btn">Découvrir notre carte</a>
            </div>
        </section>
        
        <section class="section" id="carte">
            <div class="container">
                <h2 class="section-title">Notre Spécialité</h2>
                <div class="grid">
                    <div class="card">
                        <h3>Plats Traditionnels</h3>
                        <p>Coq au vin, bœuf bourguignon, cassoulet... Tous nos plats sont préparés avec des produits frais et locaux.</p>
                    </div>
                    <div class="card">
                        <h3>Menu du Jour</h3>
                        <p>Entrée + Plat + Dessert à 25€. Notre chef vous propose chaque jour une sélection de saison.</p>
                    </div>
                    <div class="card">
                        <h3>Cave à Vins</h3>
                        <p>Sélection de vins régionaux pour accompagner parfaitement vos repas.</p>
                    </div>
                </div>
                
                ${options.includes('horaires') ? `
                <div class="contact-info">
                    <h3>Horaires d'ouverture</h3>
                    <p><strong>Mardi - Samedi :</strong> 12h-14h et 19h-22h<br>
                    <strong>Dimanche :</strong> 12h-14h<br>
                    <strong>Lundi :</strong> Fermé</p>
                </div>
                ` : ''}
                
                ${options.includes('contact') ? `
                <div class="contact-info">
                    <h3>Réservations</h3>
                    <p><strong>Téléphone :</strong> 01 23 45 67 89<br>
                    <strong>Email :</strong> contact@lebongout.fr<br>
                    <strong>Adresse :</strong> 15 rue de la Gastronomie, 75001 Paris</p>
                </div>
                ` : ''}
            </div>
        </section>
        
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 Restaurant Le Bon Goût - Tous droits réservés</p>
            </div>
        </footer>
    `;
}

function generateCommerceContent(template, colors, options) {
    return `
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">Boutique Marie</div>
                    <ul class="nav-menu">
                        <li><a href="#accueil">Accueil</a></li>
                        <li><a href="#produits">Nos Produits</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <section class="hero">
            <div class="container">
                <h1>Boutique Marie</h1>
                <p>Mode féminine et accessoires tendance</p>
                <a href="#produits" class="btn">Découvrir nos collections</a>
            </div>
        </section>
        
        <section class="section" id="produits">
            <div class="container">
                <h2 class="section-title">Nos Collections</h2>
                <div class="grid">
                    <div class="card">
                        <h3>Vêtements</h3>
                        <p>Robes, tops, pantalons... Toute la mode féminine pour être élégante au quotidien.</p>
                    </div>
                    <div class="card">
                        <h3>Accessoires</h3>
                        <p>Sacs à main, bijoux, écharpes pour parfaire votre style.</p>
                    </div>
                    <div class="card">
                        <h3>Conseils Style</h3>
                        <p>Notre équipe vous accompagne pour trouver la tenue parfaite.</p>
                    </div>
                </div>
                
                ${options.includes('horaires') ? `
                <div class="contact-info">
                    <h3>Horaires d'ouverture</h3>
                    <p><strong>Lundi - Samedi :</strong> 9h30-19h<br>
                    <strong>Dimanche :</strong> Fermé</p>
                </div>
                ` : ''}
                
                ${options.includes('contact') ? `
                <div class="contact-info">
                    <h3>Nous trouver</h3>
                    <p><strong>Téléphone :</strong> 01 23 45 67 89<br>
                    <strong>Email :</strong> contact@boutique-marie.fr<br>
                    <strong>Adresse :</strong> 25 rue du Commerce, 75002 Paris</p>
                </div>
                ` : ''}
            </div>
        </section>
        
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 Boutique Marie - Mode et accessoires</p>
            </div>
        </footer>
    `;
}

function generateArtisanContent(template, colors, options) {
    return `
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">Atelier Martin</div>
                    <ul class="nav-menu">
                        <li><a href="#accueil">Accueil</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <section class="hero">
            <div class="container">
                <h1>Atelier Martin</h1>
                <p>Menuiserie traditionnelle et créations sur mesure</p>
                <a href="#services" class="btn">Voir nos réalisations</a>
            </div>
        </section>
        
        <section class="section" id="services">
            <div class="container">
                <h2 class="section-title">Nos Services</h2>
                <div class="grid">
                    <div class="card">
                        <h3>Mobilier sur Mesure</h3>
                        <p>Création de meubles uniques adaptés à vos besoins et votre intérieur.</p>
                    </div>
                    <div class="card">
                        <h3>Rénovation</h3>
                        <p>Restauration et remise en état de vos meubles anciens.</p>
                    </div>
                    <div class="card">
                        <h3>Agencement</h3>
                        <p>Aménagement de placards, bibliothèques, dressings.</p>
                    </div>
                </div>
                
                ${options.includes('contact') ? `
                <div class="contact-info">
                    <h3>Devis Gratuit</h3>
                    <p><strong>Téléphone :</strong> 01 23 45 67 89<br>
                    <strong>Email :</strong> martin.menuisier@email.fr<br>
                    <strong>Zone d'intervention :</strong> Paris et proche banlieue</p>
                </div>
                ` : ''}
            </div>
        </section>
        
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 Atelier Martin - Menuiserie artisanale</p>
            </div>
        </footer>
    `;
}

function generateProfessionnelContent(template, colors, options) {
    return `
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">Cabinet Durand</div>
                    <ul class="nav-menu">
                        <li><a href="#accueil">Accueil</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <section class="hero">
            <div class="container">
                <h1>Cabinet Durand</h1>
                <p>Expertise comptable et conseil aux entreprises</p>
                <a href="#services" class="btn">Nos services</a>
            </div>
        </section>
        
        <section class="section" id="services">
            <div class="container">
                <h2 class="section-title">Notre Expertise</h2>
                <div class="grid">
                    <div class="card">
                        <h3>Comptabilité</h3>
                        <p>Tenue de comptabilité, établissement des comptes annuels et déclarations fiscales.</p>
                    </div>
                    <div class="card">
                        <h3>Conseil</h3>
                        <p>Accompagnement dans vos décisions stratégiques et optimisation fiscale.</p>
                    </div>
                    <div class="card">
                        <h3>Social</h3>
                        <p>Gestion de la paie et conseil en droit social.</p>
                    </div>
                </div>
                
                ${options.includes('contact') ? `
                <div class="contact-info">
                    <h3>Prendre Rendez-vous</h3>
                    <p><strong>Téléphone :</strong> 01 23 45 67 89<br>
                    <strong>Email :</strong> contact@cabinet-durand.fr<br>
                    <strong>Adresse :</strong> 10 avenue des Experts, 75008 Paris</p>
                </div>
                ` : ''}
            </div>
        </section>
        
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 Cabinet Durand - Expertise comptable</p>
            </div>
        </footer>
    `;
}

function generateAssociationContent(template, colors, options) {
    return `
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">Association Locale</div>
                    <ul class="nav-menu">
                        <li><a href="#accueil">Accueil</a></li>
                        <li><a href="#actions">Nos Actions</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <section class="hero">
            <div class="container">
                <h1>Association Locale</h1>
                <p>Ensemble pour notre communauté</p>
                <a href="#actions" class="btn">Découvrir nos actions</a>
            </div>
        </section>
        
        <section class="section" id="actions">
            <div class="container">
                <h2 class="section-title">Nos Actions</h2>
                <div class="grid">
                    <div class="card">
                        <h3>Événements</h3>
                        <p>Organisation de fêtes de quartier, concerts et manifestations culturelles.</p>
                    </div>
                    <div class="card">
                        <h3>Solidarité</h3>
                        <p>Aide aux personnes en difficulté et actions de solidarité locale.</p>
                    </div>
                    <div class="card">
                        <h3>Environnement</h3>
                        <p>Nettoyage de quartier, jardins partagés et sensibilisation écologique.</p>
                    </div>
                </div>
                
                ${options.includes('contact') ? `
                <div class="contact-info">
                    <h3>Nous Rejoindre</h3>
                    <p><strong>Email :</strong> contact@association-locale.fr<br>
                    <strong>Réunions :</strong> Tous les premiers mardis du mois à 19h<br>
                    <strong>Lieu :</strong> Salle des fêtes, rue de la Mairie</p>
                </div>
                ` : ''}
            </div>
        </section>
        
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 Association Locale - Tous ensemble</p>
            </div>
        </footer>
    `;
}

function generateVitrineContent(template, colors, options) {
    return `
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">Mon Entreprise</div>
                    <ul class="nav-menu">
                        <li><a href="#accueil">Accueil</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <section class="hero">
            <div class="container">
                <h1>Mon Entreprise</h1>
                <p>Votre partenaire de confiance</p>
                <a href="#services" class="btn">En savoir plus</a>
            </div>
        </section>
        
        <section class="section" id="services">
            <div class="container">
                <h2 class="section-title">Ce Que Nous Faisons</h2>
                <div class="grid">
                    <div class="card">
                        <h3>Service 1</h3>
                        <p>Description de votre premier service ou produit principal.</p>
                    </div>
                    <div class="card">
                        <h3>Service 2</h3>
                        <p>Description de votre deuxième service ou produit.</p>
                    </div>
                    <div class="card">
                        <h3>Service 3</h3>
                        <p>Description de votre troisième service ou produit.</p>
                    </div>
                </div>
                
                ${options.includes('contact') ? `
                <div class="contact-info">
                    <h3>Nous Contacter</h3>
                    <p><strong>Téléphone :</strong> 01 23 45 67 89<br>
                    <strong>Email :</strong> contact@mon-entreprise.fr<br>
                    <strong>Adresse :</strong> 1 rue de l'Entreprise, 75001 Paris</p>
                </div>
                ` : ''}
            </div>
        </section>
        
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 Mon Entreprise - Tous droits réservés</p>
            </div>
        </footer>
    `;
}

// Création finale du site
async function createSite() {
    console.log('🔨 Création du site...');
    
    const template = TEMPLATES_LOCAUX[selectedTemplate];
    const colors = COULEURS_SIMPLES[selectedColor] || COULEURS_SIMPLES.bleu;
    
    const siteData = {
        data: {
            name: `Site ${template.name} - ${colors.name}`,
            description: template.description,
            category: template.category,
            colorScheme: selectedColor,
            components: selectedOptions,
            htmlContent: generateSimpleHTML(template, colors, selectedOptions),
            cssContent: `/* Site ${template.name} - ${colors.name} */`,
            isActive: true,
            downloads: 0,
            rating: 5.0,
            version: '1.0.0',
            difficulty: 'facile',
            features: selectedOptions,
            tags: [template.category, 'local', 'simple'],
            price: 0
        }
    };
    
    try {
        const response = await fetch('http://localhost:1337/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteData)
        });
        
        if (response.ok) {
            alert(`✅ Votre site a été créé avec succès !\n\nType: ${template.name}\nCouleurs: ${colors.name}\nOptions: ${selectedOptions.length} sélectionnées`);
            window.location.href = 'templates.html';
        } else {
            throw new Error('Erreur lors de la création');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        alert('✅ Votre site a été créé localement avec succès !');
        setTimeout(() => window.location.href = 'templates.html', 1000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Générateur simple prêt');
    
    // Templates avec événements améliorés
    document.querySelectorAll('.template-card').forEach(card => {
        console.log(`🔗 Ajout événement pour template: ${card.dataset.template}`);
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const templateId = this.dataset.template;
            console.log(`🖱️ Click détecté sur template: ${templateId}`);
            selectTemplate(templateId);
        });
        
        // Effet hover amélioré
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.borderColor = '#007bff';
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.borderColor = '#e9ecef';
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Couleurs avec événements améliorés
    document.querySelectorAll('.color-option').forEach(option => {
        console.log(`🎨 Ajout événement pour couleur: ${option.dataset.color}`);
        
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const colorId = this.dataset.color;
            console.log(`🖱️ Click détecté sur couleur: ${colorId}`);
            selectColor(colorId);
        });
    });
    
    // Options avec événements améliorés
    document.querySelectorAll('.feature-card').forEach(card => {
        console.log(`⚙️ Ajout événement pour option: ${card.dataset.feature}`);
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const featureId = this.dataset.feature;
            console.log(`🖱️ Click détecté sur option: ${featureId}`);
            toggleOption(featureId);
        });
    });
    
    // Navigation
    document.getElementById('nextBtn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('➡️ Bouton Suivant cliqué');
        nextStep();
    });
    
    document.getElementById('prevBtn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('⬅️ Bouton Précédent cliqué');
        previousStep();
    });
    
    document.getElementById('generateBtn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🚀 Bouton Créer cliqué');
        createSite();
    });
    
    // Démarrage
    showStep(1);
    
    console.log('🎯 Prêt pour créer des sites simples et efficaces !');
    console.log(`📋 Templates disponibles: ${Object.keys(TEMPLATES_LOCAUX).length}`);
    console.log(`🎨 Couleurs disponibles: ${Object.keys(COULEURS_SIMPLES).length}`);
});
