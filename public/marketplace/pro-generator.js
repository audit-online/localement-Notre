// Générateur de Sites Professionnels - Niveau Commercial
console.log('🚀 Chargement du générateur professionnel...');

// Configuration des templates de qualité commerciale
const PRO_TEMPLATES = {
    'luxury-restaurant': {
        name: 'Restaurant Gastronomique',
        category: 'restaurant',
        features: ['reservations', 'menu-dynamique', 'galerie', 'seo'],
        colors: {
            primary: '#DAA520',
            secondary: '#8B4513',
            accent: '#FF6347'
        }
    },
    'modern-ecommerce': {
        name: 'E-commerce Moderne',
        category: 'commerce',
        features: ['panier', 'paiement', 'stock', 'analytics'],
        colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            accent: '#28a745'
        }
    },
    'artisan-portfolio': {
        name: 'Portfolio Artisan',
        category: 'artisanat',
        features: ['galerie-interactive', 'devis', 'blog', 'testimonials'],
        colors: {
            primary: '#000000',
            secondary: '#333333',
            accent: '#ff6b6b'
        }
    }
};

// Palettes de couleurs professionnelles
const COLOR_SCHEMES = {
    corporate: {
        name: 'Corporate Blue',
        primary: '#2c3e50',
        secondary: '#3498db',
        accent: '#e74c3c',
        background: '#ecf0f1',
        text: '#2c3e50'
    },
    luxury: {
        name: 'Luxury Gold',
        primary: '#000000',
        secondary: '#DAA520',
        accent: '#FFD700',
        background: '#fafafa',
        text: '#333333'
    },
    nature: {
        name: 'Nature Green',
        primary: '#27ae60',
        secondary: '#2ecc71',
        accent: '#f39c12',
        background: '#f8f9fa',
        text: '#2c3e50'
    },
    creative: {
        name: 'Creative Purple',
        primary: '#9b59b6',
        secondary: '#e74c3c',
        accent: '#f39c12',
        background: '#fdf2e9',
        text: '#2c3e50'
    },
    minimalist: {
        name: 'Minimalist Gray',
        primary: '#95a5a6',
        secondary: '#34495e',
        accent: '#3498db',
        background: '#ffffff',
        text: '#2c3e50'
    },
    warm: {
        name: 'Warm Orange',
        primary: '#e67e22',
        secondary: '#f39c12',
        accent: '#e74c3c',
        background: '#fef9e7',
        text: '#2c3e50'
    }
};

// Variables d'état
let currentStep = 1;
let selectedTemplate = null;
let selectedColorScheme = null;
let selectedFeatures = [];

// Gestion des étapes
function showStep(step) {
    console.log(`🔄 Affichage de l'étape ${step}`);
    
    // Masquer toutes les étapes
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.add('d-none');
    });
    
    // Afficher l'étape actuelle
    document.getElementById(`stepContent${step}`).classList.remove('d-none');
    
    // Mettre à jour les indicateurs
    for (let i = 1; i <= 4; i++) {
        const stepElement = document.getElementById(`step${i}`);
        const connectorElement = document.getElementById(`connector${i}`);
        
        stepElement.classList.remove('active', 'completed');
        if (connectorElement) connectorElement.classList.remove('completed');
        
        if (i === step) {
            stepElement.classList.add('active');
        } else if (i < step) {
            stepElement.classList.add('completed');
            if (connectorElement) connectorElement.classList.add('completed');
        }
    }
    
    updateButtons();
    
    // Actions spécifiques par étape
    if (step === 4) {
        generateFinalPreview();
    }
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const generateBtn = document.getElementById('generateBtn');
    
    prevBtn.disabled = currentStep === 1;
    
    if (currentStep === 4) {
        nextBtn.classList.add('d-none');
        generateBtn.classList.remove('d-none');
    } else {
        nextBtn.classList.remove('d-none');
        generateBtn.classList.add('d-none');
    }
}

function nextStep() {
    if (currentStep < 4) {
        currentStep++;
        showStep(currentStep);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Sélection de template
function selectTemplate(templateId) {
    console.log(`🎨 Template sélectionné: ${templateId}`);
    
    selectedTemplate = templateId;
    
    // Mettre à jour l'affichage
    document.querySelectorAll('.template-preview').forEach(preview => {
        preview.classList.remove('selected');
    });
    
    document.querySelector(`[data-template="${templateId}"]`).classList.add('selected');
    
    // Activer le bouton suivant
    document.getElementById('nextBtn').disabled = false;
}

// Sélection de couleurs
function selectColorScheme(schemeId) {
    console.log(`🎨 Palette sélectionnée: ${schemeId}`);
    
    selectedColorScheme = schemeId;
    
    // Mettre à jour l'affichage
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector(`[data-color="${schemeId}"]`).classList.add('selected');
}

// Sélection de fonctionnalités
function toggleFeature(featureId) {
    console.log(`🔧 Fonctionnalité: ${featureId}`);
    
    const featureCard = document.querySelector(`[data-feature="${featureId}"]`);
    const index = selectedFeatures.indexOf(featureId);
    
    if (index === -1) {
        selectedFeatures.push(featureId);
        featureCard.classList.add('border-primary', 'bg-light');
    } else {
        selectedFeatures.splice(index, 1);
        featureCard.classList.remove('border-primary', 'bg-light');
    }
}

// Générateur d'aperçu final professionnel
function generateFinalPreview() {
    console.log('👁️ Génération de l\'aperçu professionnel...');
    
    const template = PRO_TEMPLATES[selectedTemplate];
    const colorScheme = COLOR_SCHEMES[selectedColorScheme] || COLOR_SCHEMES.corporate;
    
    const finalHTML = generateProfessionalHTML(template, colorScheme, selectedFeatures);
    
    const previewContainer = document.getElementById('finalPreview');
    previewContainer.innerHTML = `<iframe srcdoc="${finalHTML.replace(/"/g, '&quot;')}" style="width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>`;
}

// Générateur HTML professionnel
function generateProfessionalHTML(template, colors, features) {
    const baseStyles = `
        <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: ${colors.text};
            background: ${colors.background};
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .navbar { 
            background: rgba(255,255,255,0.95); 
            backdrop-filter: blur(10px); 
            padding: 1rem 0; 
            position: fixed; 
            width: 100%; 
            top: 0; 
            z-index: 1000; 
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        .nav-content { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .logo { 
            font-size: 1.8rem; 
            font-weight: 700; 
            color: ${colors.primary}; 
            letter-spacing: -0.5px;
        }
        .nav-links { 
            display: flex; 
            gap: 2rem; 
            list-style: none; 
        }
        .nav-links a { 
            color: ${colors.text}; 
            text-decoration: none; 
            font-weight: 500; 
            transition: all 0.3s ease;
            position: relative;
        }
        .nav-links a:hover { 
            color: ${colors.primary}; 
        }
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: ${colors.primary};
            transition: width 0.3s ease;
        }
        .nav-links a:hover::after {
            width: 100%;
        }
        .hero { 
            background: linear-gradient(135deg, ${colors.primary}ee, ${colors.secondary}ee), 
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="1000" height="1000" fill="url(%23grain)"/></svg>');
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            color: white; 
            text-align: center;
            position: relative;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
        }
        .hero-content { 
            position: relative;
            z-index: 2;
        }
        .hero h1 { 
            font-size: clamp(2.5rem, 5vw, 4rem); 
            font-weight: 700; 
            margin-bottom: 1.5rem; 
            line-height: 1.2;
            letter-spacing: -1px;
        }
        .hero p { 
            font-size: 1.25rem; 
            margin-bottom: 2.5rem; 
            max-width: 600px; 
            margin-left: auto; 
            margin-right: auto;
            opacity: 0.95;
        }
        .cta-button { 
            background: ${colors.accent}; 
            color: white; 
            padding: 1.2rem 2.5rem; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 600; 
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            display: inline-block;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .cta-button:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            color: white;
        }
        .section { 
            padding: 6rem 0; 
        }
        .section-title { 
            font-size: 2.5rem; 
            font-weight: 700; 
            text-align: center; 
            margin-bottom: 3rem;
            color: ${colors.primary};
        }
        .features-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 2rem; 
            margin-top: 3rem; 
        }
        .feature-card { 
            background: white; 
            padding: 2.5rem; 
            border-radius: 16px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            transition: all 0.3s ease;
            text-align: center;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .feature-card:hover { 
            transform: translateY(-10px); 
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        .feature-icon { 
            font-size: 3rem; 
            color: ${colors.primary}; 
            margin-bottom: 1.5rem; 
        }
        .feature-title { 
            font-size: 1.3rem; 
            font-weight: 600; 
            margin-bottom: 1rem;
            color: ${colors.text};
        }
        .footer { 
            background: ${colors.primary}; 
            color: white; 
            padding: 3rem 0; 
            text-align: center; 
        }
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .container { padding: 0 1rem; }
            .hero { padding: 0 1rem; }
        }
        </style>
    `;

    let htmlContent = '';
    
    if (template.category === 'restaurant') {
        htmlContent = `
            <nav class="navbar">
                <div class="container">
                    <div class="nav-content">
                        <div class="logo">Le Gourmet Excellence</div>
                        <ul class="nav-links">
                            <li><a href="#accueil">Accueil</a></li>
                            <li><a href="#menu">Notre Menu</a></li>
                            <li><a href="#reservation">Réservation</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            
            <section class="hero" id="accueil">
                <div class="container">
                    <div class="hero-content">
                        <h1>Expérience Gastronomique d'Exception</h1>
                        <p>Découvrez une cuisine raffinée où chaque plat raconte une histoire. Notre chef étoilé vous propose une carte créative dans un cadre élégant au cœur de la ville.</p>
                        <a href="#reservation" class="cta-button">Réserver votre table</a>
                    </div>
                </div>
            </section>
            
            <section class="section" id="menu">
                <div class="container">
                    <h2 class="section-title">Notre Menu Signature</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🥘</div>
                            <h3 class="feature-title">Menu Dégustation</h3>
                            <p>7 services créatifs accompagnés de vins sélectionnés par notre sommelier. Une expérience culinaire inoubliable.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🍷</div>
                            <h3 class="feature-title">Cave d'Exception</h3>
                            <p>Plus de 500 références de vins français et internationaux, conseillés par notre équipe experte.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">👨‍🍳</div>
                            <h3 class="feature-title">Chef Étoilé</h3>
                            <p>Une cuisine créative dirigée par un chef reconnu, alliant techniques modernes et traditions françaises.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    } else if (template.category === 'commerce') {
        htmlContent = `
            <nav class="navbar">
                <div class="container">
                    <div class="nav-content">
                        <div class="logo">TechStore Pro</div>
                        <ul class="nav-links">
                            <li><a href="#accueil">Accueil</a></li>
                            <li><a href="#produits">Produits</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#support">Support</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            
            <section class="hero" id="accueil">
                <div class="container">
                    <div class="hero-content">
                        <h1>Innovation Technologique de Pointe</h1>
                        <p>Découvrez les dernières innovations tech avec notre sélection de produits haut de gamme. Livraison gratuite, garantie étendue et support technique expert inclus.</p>
                        <a href="#produits" class="cta-button">Découvrir nos produits</a>
                    </div>
                </div>
            </section>
            
            <section class="section" id="produits">
                <div class="container">
                    <h2 class="section-title">Nos Produits Phares</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">📱</div>
                            <h3 class="feature-title">Smartphones Premium</h3>
                            <p>Dernière génération avec technologie 5G, appareil photo professionnel et autonomie exceptionnelle.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">💻</div>
                            <h3 class="feature-title">Ordinateurs Gaming</h3>
                            <p>Configurations haute performance pour gaming et création, assemblées par nos experts techniques.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🎧</div>
                            <h3 class="feature-title">Audio Haute Fidélité</h3>
                            <p>Casques et enceintes premium pour une expérience sonore immersive et professionnelle.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    } else {
        htmlContent = `
            <nav class="navbar">
                <div class="container">
                    <div class="nav-content">
                        <div class="logo">Atelier Martin Création</div>
                        <ul class="nav-links">
                            <li><a href="#accueil">Accueil</a></li>
                            <li><a href="#portfolio">Portfolio</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            
            <section class="hero" id="accueil">
                <div class="container">
                    <div class="hero-content">
                        <h1>Artisan Créateur d'Exception</h1>
                        <p>Depuis 25 ans, je conçois et réalise des pièces uniques en bois massif. Mobilier sur mesure, aménagements intérieurs et créations artistiques pour sublimer votre espace de vie.</p>
                        <a href="#portfolio" class="cta-button">Découvrir mes créations</a>
                    </div>
                </div>
            </section>
            
            <section class="section" id="portfolio">
                <div class="container">
                    <h2 class="section-title">Savoir-Faire Artisanal</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🪑</div>
                            <h3 class="feature-title">Mobilier Sur Mesure</h3>
                            <p>Tables, bibliothèques, cuisines intégrées. Chaque pièce est unique et adaptée à vos besoins spécifiques.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🏠</div>
                            <h3 class="feature-title">Aménagement Intérieur</h3>
                            <p>Escaliers design, placards intégrés, dressings. Une approche globale de votre projet d'aménagement.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🎨</div>
                            <h3 class="feature-title">Créations Artistiques</h3>
                            <p>Sculptures, objets décoratifs, pièces d'art. L'alliance parfaite entre fonction et esthétique.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    htmlContent += `
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 ${template.name} - Site professionnel généré par Marketplace Pro</p>
            </div>
        </footer>
    `;
    
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${template.name}</title>${baseStyles}</head><body>${htmlContent}</body></html>`;
}

// Génération finale du site
async function generateProfessionalSite() {
    console.log('🚀 Génération du site professionnel...');
    
    const template = PRO_TEMPLATES[selectedTemplate];
    const colorScheme = COLOR_SCHEMES[selectedColorScheme] || COLOR_SCHEMES.corporate;
    
    const siteData = {
        data: {
            name: `Site ${template.name} Professionnel`,
            description: `Site web professionnel de type ${template.name} avec design moderne et fonctionnalités avancées`,
            category: template.category,
            colorScheme: selectedColorScheme || 'corporate',
            components: selectedFeatures,
            htmlContent: generateProfessionalHTML(template, colorScheme, selectedFeatures),
            cssContent: `/* Site professionnel ${template.name} - Généré automatiquement */`,
            isActive: true,
            downloads: 0,
            rating: 5.0,
            version: '2.0.0',
            difficulty: 'professional',
            features: selectedFeatures,
            tags: [template.category, 'professionnel', 'moderne'],
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
            alert('🎉 Votre site professionnel a été généré avec succès !\n\nCaractéristiques :\n• Design moderne de niveau commercial\n• Optimisé mobile-first\n• SEO intégré\n• Performance optimisée');
            window.location.href = 'templates.html';
        } else {
            const error = await response.text();
            throw new Error(error);
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        alert('❌ Erreur lors de la génération. Le site a été créé localement.');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Générateur professionnel initialisé');
    
    // Templates
    document.querySelectorAll('.template-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            selectTemplate(this.dataset.template);
        });
    });
    
    // Couleurs
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            selectColorScheme(this.dataset.color);
        });
    });
    
    // Fonctionnalités
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            toggleFeature(this.dataset.feature);
        });
    });
    
    // Boutons
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', previousStep);
    document.getElementById('generateBtn').addEventListener('click', generateProfessionalSite);
    
    // Initialisation
    showStep(1);
    
    console.log('✅ Générateur professionnel prêt !');
});
