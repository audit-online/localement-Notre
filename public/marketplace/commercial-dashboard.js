class CommercialDashboard {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('user_data') || '{}');
        this.prospects = [];
        this.merchants = [];
        this.plans = [];
        
        this.initializeApp();
    }

    async initializeApp() {
        // Vérifier l'authentification
        if (!this.token || this.user.role?.type !== 'commercial') {
            window.location.href = '/marketplace/auth.html';
            return;
        }

        // Afficher le nom utilisateur
        document.getElementById('userName').textContent = this.user.username || 'Commercial';

        // Initialiser les événements
        this.initializeEventListeners();

        // Charger les données
        await this.loadInitialData();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Formulaires
        document.getElementById('onboardingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOnboarding();
        });

        document.getElementById('addLeadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddLead();
        });

        // Recherche prospects
        document.getElementById('leadsSearch').addEventListener('input', (e) => {
            this.filterLeads(e.target.value);
        });
    }

    showSection(sectionId) {
        // Masquer toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Afficher la section demandée
        document.getElementById(sectionId).style.display = 'block';

        // Mettre à jour la navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Charger les données spécifiques à la section
        switch(sectionId) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'leads':
                this.loadLeads();
                break;
            case 'onboarding':
                this.loadPlans();
                break;
            case 'merchants':
                this.loadMerchants();
                break;
            case 'sales':
                this.loadSalesData();
                break;
        }
    }

    async loadInitialData() {
        try {
            await Promise.all([
                this.loadDashboardData(),
                this.loadPlans()
            ]);
        } catch (error) {
            console.error('Erreur chargement données initiales:', error);
        }
    }

    async loadDashboardData() {
        try {
            const response = await this.apiCall('/api/platform/dashboard');
            const data = response.data;

            // Mettre à jour les statistiques
            document.getElementById('totalLeads').textContent = data.totalLeads || 0;
            document.getElementById('totalDemos').textContent = data.totalDemos || 0;
            document.getElementById('totalConverted').textContent = data.totalMerchants || 0;
            document.getElementById('totalRevenue').textContent = `${data.totalRevenue || 0}€`;

            // Charger les activités récentes
            this.loadRecentActivities();

        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        }
    }

    async loadRecentActivities() {
        const activities = [
            {
                date: new Date().toLocaleDateString(),
                prospect: 'Boulangerie Martin',
                action: 'Démo planifiée',
                status: 'pending'
            },
            {
                date: new Date(Date.now() - 86400000).toLocaleDateString(),
                prospect: 'Restaurant Le Bon Goût',
                action: 'Conversion réussie',
                status: 'active'
            },
            {
                date: new Date(Date.now() - 172800000).toLocaleDateString(),
                prospect: 'Boutique Clara',
                action: 'Premier contact',
                status: 'trial'
            }
        ];

        const tbody = document.getElementById('recentActivities');
        tbody.innerHTML = activities.map(activity => `
            <tr>
                <td>${activity.date}</td>
                <td>${activity.prospect}</td>
                <td>${activity.action}</td>
                <td><span class="status-badge ${activity.status}">${this.getStatusLabel(activity.status)}</span></td>
            </tr>
        `).join('');
    }

    async loadLeads() {
        try {
            // Simulation de prospects pour la démo
            this.prospects = [
                {
                    id: 1,
                    name: 'Jean Dupont',
                    email: 'jean.dupont@boulangerie-martin.fr',
                    phone: '01 23 45 67 89',
                    sector: 'Boulangerie',
                    status: 'contacted'
                },
                {
                    id: 2,
                    name: 'Marie Leclerc',
                    email: 'marie@restaurant-bongoût.fr',
                    phone: '01 34 56 78 90',
                    sector: 'Restaurant',
                    status: 'demo'
                },
                {
                    id: 3,
                    name: 'Pierre Bernard',
                    email: 'pierre@artisan-bois.fr',
                    phone: '01 45 67 89 01',
                    sector: 'Artisanat',
                    status: 'interested'
                }
            ];

            this.renderLeads();

        } catch (error) {
            console.error('Erreur chargement prospects:', error);
        }
    }

    renderLeads(filteredLeads = null) {
        const leadsToRender = filteredLeads || this.prospects;
        const tbody = document.getElementById('leadsTable');
        
        tbody.innerHTML = leadsToRender.map(lead => `
            <tr>
                <td>${lead.name}</td>
                <td>${lead.email}</td>
                <td>${lead.phone}</td>
                <td>${lead.sector}</td>
                <td><span class="status-badge ${lead.status}">${this.getStatusLabel(lead.status)}</span></td>
                <td>
                    <button class="btn btn-primary" onclick="dashboard.contactLead(${lead.id})">
                        <i class="fas fa-phone"></i>
                        Contacter
                    </button>
                    <button class="btn btn-success" onclick="dashboard.convertLead(${lead.id})">
                        <i class="fas fa-user-check"></i>
                        Convertir
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterLeads(searchTerm) {
        const filtered = this.prospects.filter(lead => 
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.sector.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderLeads(filtered);
    }

    async loadPlans() {
        try {
            const response = await this.apiCall('/api/subscription-plans/active');
            this.plans = response.data || [];

            const select = document.getElementById('planId');
            select.innerHTML = this.plans.map(plan => 
                `<option value="${plan.id}">${plan.name} - ${plan.price}€/${plan.billingPeriod}</option>`
            ).join('');

        } catch (error) {
            console.error('Erreur chargement plans:', error);
            document.getElementById('planId').innerHTML = '<option value="">Erreur chargement plans</option>';
        }
    }

    async loadMerchants() {
        try {
            const response = await this.apiCall('/api/merchants?populate=*');
            this.merchants = response.data || [];

            const tbody = document.getElementById('merchantsTable');
            tbody.innerHTML = this.merchants.map(merchant => `
                <tr>
                    <td>${merchant.businessName}</td>
                    <td>
                        <div>${merchant.contactEmail}</div>
                        <div style="font-size: 0.8rem; color: #666;">${merchant.phone || 'N/A'}</div>
                    </td>
                    <td>
                        ${merchant.subscription?.plan?.name || 'Aucun plan'}
                        <br>
                        <span class="status-badge ${merchant.subscription?.status || 'pending'}">
                            ${this.getStatusLabel(merchant.subscription?.status || 'pending')}
                        </span>
                    </td>
                    <td>
                        ${merchant.backend?.subdomain || 'Non créé'}
                        <br>
                        <span class="status-badge ${merchant.backend?.status || 'pending'}">
                            ${this.getBackendStatusLabel(merchant.backend?.status || 'pending')}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge ${merchant.isActive ? 'active' : 'pending'}">
                            ${merchant.isActive ? 'Actif' : 'Inactif'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-primary" onclick="dashboard.viewMerchant(${merchant.id})">
                            <i class="fas fa-eye"></i>
                            Voir
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Erreur chargement commerçants:', error);
        }
    }

    async loadSalesData() {
        try {
            const response = await this.apiCall('/api/platform/dashboard');
            const data = response.data;

            document.getElementById('monthlyRevenue').textContent = `${data.monthlyRevenue || 0}€`;
            document.getElementById('conversionRate').textContent = `${data.conversionRate || 0}%`;

        } catch (error) {
            console.error('Erreur chargement données ventes:', error);
        }
    }

    async handleOnboarding() {
        try {
            const formData = new FormData(document.getElementById('onboardingForm'));
            const data = Object.fromEntries(formData.entries());

            this.showAlert('onboardingAlert', 'Création du commerçant en cours...', 'success');

            const response = await this.apiCall('/api/platform/onboard-merchant', 'POST', data);

            if (response.success) {
                this.showAlert('onboardingAlert', 'Commerçant créé avec succès !', 'success');
                document.getElementById('onboardingForm').reset();
                
                // Actualiser les données
                setTimeout(() => {
                    this.loadMerchants();
                    this.loadDashboardData();
                }, 2000);
            } else {
                throw new Error(response.error || 'Erreur lors de la création');
            }

        } catch (error) {
            console.error('Erreur onboarding:', error);
            this.showAlert('onboardingAlert', 'Erreur lors de la création du commerçant', 'error');
        }
    }

    async handleAddLead() {
        try {
            const formData = new FormData(document.getElementById('addLeadForm'));
            const data = Object.fromEntries(formData.entries());

            // Ajouter le prospect à la liste locale (simulation)
            const newLead = {
                id: this.prospects.length + 1,
                ...data,
                status: 'new'
            };

            this.prospects.push(newLead);
            this.renderLeads();
            this.closeModal('addLeadModal');
            document.getElementById('addLeadForm').reset();

            // Mise à jour du compteur
            document.getElementById('totalLeads').textContent = this.prospects.length;

        } catch (error) {
            console.error('Erreur ajout prospect:', error);
        }
    }

    async contactLead(leadId) {
        const lead = this.prospects.find(l => l.id === leadId);
        if (lead) {
            lead.status = 'contacted';
            this.renderLeads();
            alert(`Contact établi avec ${lead.name}`);
        }
    }

    async convertLead(leadId) {
        const lead = this.prospects.find(l => l.id === leadId);
        if (lead) {
            // Rediriger vers l'onboarding avec les données pré-remplies
            this.showSection('onboarding');
            
            // Pré-remplir le formulaire
            document.getElementById('businessName').value = lead.name;
            document.getElementById('contactEmail').value = lead.email;
            document.getElementById('contactPhone').value = lead.phone;
            document.getElementById('businessType').value = lead.sector.toLowerCase();
            document.getElementById('username').value = lead.name.toLowerCase().replace(/\s+/g, '');
        }
    }

    viewMerchant(merchantId) {
        alert(`Affichage du détail du commerçant ID: ${merchantId}`);
        // Ici on pourrait ouvrir une modal avec les détails
    }

    refreshMerchants() {
        this.loadMerchants();
    }

    showAddLeadModal() {
        document.getElementById('addLeadModal').style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showAlert(alertId, message, type) {
        const alert = document.getElementById(alertId);
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }
    }

    getStatusLabel(status) {
        const labels = {
            'new': 'Nouveau',
            'contacted': 'Contacté',
            'demo': 'Démo',
            'interested': 'Intéressé',
            'converted': 'Converti',
            'active': 'Actif',
            'pending': 'En attente',
            'trial': 'Essai',
            'cancelled': 'Annulé'
        };
        return labels[status] || status;
    }

    getBackendStatusLabel(status) {
        const labels = {
            'creating': 'Création',
            'active': 'Actif',
            'error': 'Erreur',
            'pending': 'En attente'
        };
        return labels[status] || status;
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify({ data });
        }

        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    }
}

// Fonction de déconnexion globale
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/marketplace/auth.html';
}

// Fonctions globales pour les événements onclick
function showAddLeadModal() {
    dashboard.showAddLeadModal();
}

function closeModal(modalId) {
    dashboard.closeModal(modalId);
}

function refreshMerchants() {
    dashboard.refreshMerchants();
}

// Initialiser l'application
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new CommercialDashboard();
});
