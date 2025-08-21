// Créateur de Templates - JavaScript externe pour éviter les problèmes CSP
console.log('🚀 Chargement du créateur de templates...');

// Variables globales
let currentStep = 1;
let templateData = {
    type: '',
    color: '',
    components: [],
    name: '',
    description: ''
};

// Fonctions utilitaires
function showStep(step) {
    console.log('🔄 Affichage de l\'étape:', step);
    
    // Masquer toutes les étapes
    document.querySelectorAll('.step-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Afficher l'étape actuelle
    const currentContainer = document.getElementById(`stepContainer${step}`);
    if (currentContainer) {
        currentContainer.classList.add('active');
    }
    
    // Mettre à jour les indicateurs
    document.querySelectorAll('.step-number').forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        if (index + 1 === step) {
            indicator.classList.add('active');
        } else if (index + 1 < step) {
            indicator.classList.add('completed');
        }
    });
    
    // Mettre à jour les boutons
    updateButtons();
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (prevBtn) prevBtn.disabled = currentStep === 1;
    
    if (currentStep === 4) {
        if (nextBtn) nextBtn.classList.add('d-none');
        if (saveBtn) saveBtn.classList.remove('d-none');
    } else {
        if (nextBtn) nextBtn.classList.remove('d-none');
        if (saveBtn) saveBtn.classList.add('d-none');
    }
}

function nextStep() {
    console.log('➡️ Étape suivante demandée');
    if (currentStep < 4) {
        currentStep++;
        showStep(currentStep);
        if (currentStep === 4) {
            generatePreview();
        }
    }
}

function previousStep() {
    console.log('⬅️ Étape précédente demandée');
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Gestion des sélections
function selectTemplateType(type) {
    console.log('🎯 Type sélectionné:', type);
    templateData.type = type;
    
    // Mettre à jour l'affichage
    document.querySelectorAll('.template-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-type="${type}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        console.log('✅ Carte sélectionnée');
    }
    
    updateSummary();
}

function selectColor(color) {
    console.log('🎨 Couleur sélectionnée:', color);
    templateData.color = color;
    
    // Mettre à jour l'affichage
    document.querySelectorAll('.color-choice').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedColor = document.querySelector(`[data-color="${color}"]`);
    if (selectedColor) {
        selectedColor.classList.add('selected');
    }
    
    // Mettre à jour l'aperçu des couleurs
    const colorMap = {
        blue: '#007bff',
        green: '#28a745',
        red: '#dc3545',
        orange: '#fd7e14',
        purple: '#6f42c1',
        pink: '#e83e8c',
        dark: '#343a40',
        teal: '#20c997'
    };
    
    const colorPreview = document.getElementById('colorPreview');
    if (colorPreview && colorMap[color]) {
        colorPreview.style.backgroundColor = colorMap[color];
    }
    
    updateSummary();
}

function toggleComponent(component) {
    console.log('🧩 Composant cliqué:', component);
    
    const index = templateData.components.indexOf(component);
    const element = document.querySelector(`[data-component="${component}"]`);
    
    if (index === -1) {
        // Ajouter le composant
        templateData.components.push(component);
        if (element) element.classList.add('selected');
        console.log('✅ Composant ajouté:', component);
    } else {
        // Retirer le composant
        templateData.components.splice(index, 1);
        if (element) element.classList.remove('selected');
        console.log('❌ Composant retiré:', component);
    }
    
    updateSummary();
}

function updateSummary() {
    const summaryType = document.getElementById('summaryType');
    const summaryColor = document.getElementById('summaryColor');
    const summaryComponents = document.getElementById('summaryComponents');
    
    if (summaryType) {
        summaryType.textContent = templateData.type || 'Non sélectionné';
    }
    
    if (summaryColor) {
        summaryColor.textContent = templateData.color || 'Non sélectionnée';
    }
    
    if (summaryComponents) {
        summaryComponents.textContent = templateData.components.length > 0 
            ? templateData.components.join(', ') 
            : 'Aucun';
    }
    
    console.log('📊 Résumé mis à jour:', templateData);
}

function generatePreview() {
    console.log('👁️ Génération de l\'aperçu...');
    
    const preview = document.getElementById('templatePreview');
    if (!preview) return;
    
    const colorMap = {
        blue: '#007bff',
        green: '#28a745',
        red: '#dc3545',
        orange: '#fd7e14',
        purple: '#6f42c1',
        pink: '#e83e8c',
        dark: '#343a40',
        teal: '#20c997'
    };
    
    const primaryColor = colorMap[templateData.color] || '#007bff';
    
    let html = `
        <div style="font-family: Arial, sans-serif;">
            <div style="background-color: ${primaryColor}; color: white; padding: 20px; text-align: center;">
                <h2>Template ${templateData.type.charAt(0).toUpperCase() + templateData.type.slice(1)}</h2>
            </div>
    `;
    
    templateData.components.forEach(component => {
        switch(component) {
            case 'header':
                html += `<div style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6;">
                    <strong>Navigation</strong> | Accueil | Services | Contact
                </div>`;
                break;
            case 'hero':
                html += `<div style="padding: 40px; text-align: center; background-color: ${primaryColor}20;">
                    <h3>Section Hero</h3>
                    <p>Bienvenue sur notre site</p>
                </div>`;
                break;
            case 'about':
                html += `<div style="padding: 30px;">
                    <h4>À propos</h4>
                    <p>Présentation de l'entreprise...</p>
                </div>`;
                break;
            case 'services':
                html += `<div style="padding: 30px; background-color: #f8f9fa;">
                    <h4>Nos Services</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div style="padding: 15px; background: white; border-radius: 8px;">Service 1</div>
                        <div style="padding: 15px; background: white; border-radius: 8px;">Service 2</div>
                        <div style="padding: 15px; background: white; border-radius: 8px;">Service 3</div>
                    </div>
                </div>`;
                break;
            case 'gallery':
                html += `<div style="padding: 30px;">
                    <h4>Galerie</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                        <div style="height: 100px; background: #ddd; border-radius: 8px;"></div>
                        <div style="height: 100px; background: #ddd; border-radius: 8px;"></div>
                        <div style="height: 100px; background: #ddd; border-radius: 8px;"></div>
                    </div>
                </div>`;
                break;
            case 'testimonials':
                html += `<div style="padding: 30px; background-color: #f8f9fa;">
                    <h4>Témoignages</h4>
                    <blockquote style="font-style: italic;">"Service excellent !" - Client satisfait</blockquote>
                </div>`;
                break;
            case 'contact':
                html += `<div style="padding: 30px;">
                    <h4>Contact</h4>
                    <p>📧 contact@exemple.com | 📞 01 23 45 67 89</p>
                </div>`;
                break;
            case 'footer':
                html += `<div style="padding: 20px; background-color: ${primaryColor}; color: white; text-align: center;">
                    <p>&copy; 2025 - Tous droits réservés</p>
                </div>`;
                break;
        }
    });
    
    html += '</div>';
    preview.innerHTML = html;
    
    console.log('✅ Aperçu généré');
}

async function saveTemplate() {
    console.log('💾 Sauvegarde du template...');
    
    const nameInput = document.getElementById('templateName');
    const descInput = document.getElementById('templateDescription');
    
    templateData.name = nameInput ? nameInput.value || 'Template sans nom' : 'Template sans nom';
    templateData.description = descInput ? descInput.value || 'Aucune description' : 'Aucune description';
    
    // Données à envoyer (format Strapi)
    const templatePayload = {
        data: {
            name: templateData.name,
            description: templateData.description,
            category: templateData.type || 'general', // Utiliser 'general' par défaut
            colorScheme: templateData.color || 'blue',
            components: templateData.components || [],
            htmlContent: document.getElementById('templatePreview') ? document.getElementById('templatePreview').innerHTML : '',
            cssContent: `/* Template CSS pour ${templateData.name} */`,
            isActive: true,
            downloads: 0,
            rating: 5.0,
            // Champs possiblement requis
            version: '1.0.0',
            difficulty: 'beginner',
            demoUrl: '',
            documentationUrl: '',
            changelogUrl: '',
            supportUrl: '',
            tags: [templateData.type],
            compatibleWith: ['strapi'],
            requirements: 'Aucun',
            installation: 'Installation automatique',
            usage: 'Utilisation simple',
            features: templateData.components,
            screenshots: [],
            price: 0,
            discount: 0,
            featured: false
        }
    };
    
    console.log('📤 Données à envoyer:', templatePayload);
    
    try {
        const response = await fetch('http://localhost:1337/api/templates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(templatePayload)
        });
        
        console.log('📡 Réponse du serveur:', response.status, response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Template créé:', result);
            alert('✅ Template sauvegardé avec succès !');
            window.location.href = 'templates.html';
        } else {
            const errorData = await response.text();
            console.error('❌ Erreur serveur:', errorData);
            throw new Error(`Erreur ${response.status}: ${errorData}`);
        }
    } catch (error) {
        console.error('❌ Erreur complète:', error);
        alert(`❌ Erreur lors de la sauvegarde: ${error.message}`);
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Initialisation du créateur de templates...');
    
    // Types de template
    const typeCards = document.querySelectorAll('.template-type-card');
    console.log('📱 Types trouvés:', typeCards.length);
    
    typeCards.forEach(card => {
        card.addEventListener('click', function() {
            selectTemplateType(this.dataset.type);
        });
    });
    
    // Couleurs
    const colorOptions = document.querySelectorAll('.color-choice');
    console.log('🎨 Couleurs trouvées:', colorOptions.length);
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectColor(this.dataset.color);
        });
    });
    
    // Composants
    const componentItems = document.querySelectorAll('.component-choice');
    console.log('🧩 Composants trouvés:', componentItems.length);
    
    componentItems.forEach(item => {
        item.addEventListener('click', function() {
            toggleComponent(this.dataset.component);
        });
    });
    
    // Boutons de navigation
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousStep);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveTemplate);
    }
    
    // Initialiser l'affichage
    showStep(1);
    updateSummary();
    
    console.log('✅ Créateur de templates prêt !');
});
