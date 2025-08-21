// Configuration API
const API_URL = 'http://localhost:1337/api';

// Variables globales
let currentSection = 'dashboard';
let dashboardData = null;

// Classes utilitaires
class PlatformAPI {
    static async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async put(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

class NotificationManager {
    static show(message, type = 'info') {
        // Créer une notification toast
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'} border-0`;
        toast.setAttribute('role', 'alert');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Supprimer après fermeture
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    static createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }
}

// Fonctions de navigation
function showSection(sectionName) {
    // Masquer toutes les sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Mettre à jour le titre
    const titles = {
        dashboard: 'Dashboard Plateforme',
        merchants: 'Gestion des Commerçants',
        subscriptions: 'Gestion des Abonnements',
        support: 'Support Client',
        backends: 'Backends des Commerçants',
        plans: 'Plans d\'Abonnement'
    };
    
    document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';
    currentSection = sectionName;
    
    // Charger les données de la section
    loadSectionData(sectionName);
}

// Chargement des données
async function loadDashboard() {
    try {
        showLoading(true);
        
        const response = await PlatformAPI.get('/platform/dashboard');
        dashboardData = response.data;
        
        // Mettre à jour les statistiques
        document.getElementById('stat-merchants').textContent = dashboardData.merchants.total;
        document.getElementById('stat-new-merchants').textContent = dashboardData.merchants.newThisMonth;
        document.getElementById('stat-subscriptions').textContent = dashboardData.subscriptions.active;
        document.getElementById('stat-trial').textContent = dashboardData.subscriptions.trial;
        document.getElementById('stat-revenue').textContent = `${dashboardData.subscriptions.monthlyRevenue}€`;
        document.getElementById('stat-tickets').textContent = dashboardData.support.openTickets;
        document.getElementById('stat-urgent').textContent = dashboardData.support.urgentTickets;
        
        // Afficher les commerçants récents
        displayRecentMerchants(dashboardData.merchants.recent);
        
        // Afficher les tickets récents
        displayRecentTickets(dashboardData.support.recent);
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        NotificationManager.show('Erreur lors du chargement du dashboard', 'error');
        showLoading(false);
    }
}

function displayRecentMerchants(merchants) {
    const container = document.getElementById('recent-merchants');
    
    if (!merchants || merchants.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Aucun commerçant récent</td></tr>';
        return;
    }
    
    container.innerHTML = merchants.map(merchant => `
        <tr>
            <td>${merchant.name}</td>
            <td>${merchant.email}</td>
            <td>${merchant.city}</td>
            <td>${formatDate(merchant.createdAt)}</td>
            <td>
                <span class="badge ${merchant.isActive ? 'bg-success' : 'bg-warning'} badge-custom">
                    ${merchant.isActive ? 'Actif' : 'Inactif'}
                </span>
            </td>
        </tr>
    `).join('');
}

function displayRecentTickets(tickets) {
    const container = document.getElementById('recent-tickets');
    
    if (!tickets || tickets.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucun ticket récent</p>';
        return;
    }
    
    container.innerHTML = tickets.map(ticket => `
        <div class="d-flex justify-content-between align-items-start mb-3 p-3 border rounded">
            <div>
                <h6 class="mb-1">${ticket.title}</h6>
                <small class="text-muted">${ticket.merchant?.name || 'N/A'}</small>
            </div>
            <span class="badge ${getPriorityColor(ticket.priority)} badge-custom">
                ${ticket.priority}
            </span>
        </div>
    `).join('');
}

async function loadMerchants() {
    try {
        showLoading(true);
        
        const response = await PlatformAPI.get('/merchants?populate=subscription,backend');
        const merchants = response.data;
        
        const tbody = document.querySelector('#merchants-table tbody');
        
        if (!merchants || merchants.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucun commerçant</td></tr>';
            showLoading(false);
            return;
        }
        
        tbody.innerHTML = merchants.map(merchant => `
            <tr>
                <td>${merchant.name}</td>
                <td>${merchant.email}</td>
                <td>
                    <span class="badge bg-info badge-custom">
                        ${getBusinessTypeLabel(merchant.businessType)}
                    </span>
                </td>
                <td>${merchant.city}</td>
                <td>
                    ${merchant.subscription ? 
                        `<span class="badge ${getSubscriptionStatusColor(merchant.subscription.status)} badge-custom">
                            ${merchant.subscription.status}
                        </span>` : 
                        '<span class="badge bg-secondary badge-custom">Aucun</span>'
                    }
                </td>
                <td>
                    ${merchant.backend ? 
                        `<span class="badge ${getBackendStatusColor(merchant.backend.status)} badge-custom">
                            ${merchant.backend.status}
                        </span>` : 
                        '<span class="badge bg-secondary badge-custom">Aucun</span>'
                    }
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewMerchantDetails(${merchant.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editMerchant(${merchant.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur chargement commerçants:', error);
        NotificationManager.show('Erreur lors du chargement des commerçants', 'error');
        showLoading(false);
    }
}

async function loadSubscriptions() {
    try {
        showLoading(true);
        
        const response = await PlatformAPI.get('/subscriptions?populate=merchant,plan');
        const subscriptions = response.data;
        
        const tbody = document.querySelector('#subscriptions-table tbody');
        
        if (!subscriptions || subscriptions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Aucun abonnement</td></tr>';
            showLoading(false);
            return;
        }
        
        tbody.innerHTML = subscriptions.map(subscription => `
            <tr>
                <td>${subscription.merchant?.name || 'N/A'}</td>
                <td>${subscription.plan?.name || 'N/A'}</td>
                <td>
                    <span class="badge ${getSubscriptionStatusColor(subscription.status)} badge-custom">
                        ${subscription.status}
                    </span>
                </td>
                <td>${subscription.amount}€</td>
                <td>${formatDate(subscription.nextBillingDate)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewSubscription(${subscription.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${subscription.status === 'active' ? 
                        `<button class="btn btn-sm btn-outline-danger" onclick="cancelSubscription(${subscription.id})">
                            <i class="bi bi-x-circle"></i>
                        </button>` : ''
                    }
                </td>
            </tr>
        `).join('');
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur chargement abonnements:', error);
        NotificationManager.show('Erreur lors du chargement des abonnements', 'error');
        showLoading(false);
    }
}

async function loadSupportTickets() {
    try {
        showLoading(true);
        
        const response = await PlatformAPI.get('/support-tickets?populate=merchant,assignedTo');
        const tickets = response.data;
        
        const tbody = document.querySelector('#tickets-table tbody');
        
        if (!tickets || tickets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucun ticket</td></tr>';
            showLoading(false);
            return;
        }
        
        tbody.innerHTML = tickets.map(ticket => `
            <tr>
                <td><code>${ticket.ticketNumber}</code></td>
                <td>${ticket.title}</td>
                <td>${ticket.merchant?.name || 'N/A'}</td>
                <td>
                    <span class="badge bg-info badge-custom">
                        ${ticket.category}
                    </span>
                </td>
                <td>
                    <span class="badge ${getPriorityColor(ticket.priority)} badge-custom">
                        ${ticket.priority}
                    </span>
                </td>
                <td>
                    <span class="badge ${getTicketStatusColor(ticket.status)} badge-custom">
                        ${ticket.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewTicket(${ticket.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="assignTicket(${ticket.id})">
                        <i class="bi bi-person-plus"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur chargement tickets:', error);
        NotificationManager.show('Erreur lors du chargement des tickets', 'error');
        showLoading(false);
    }
}

async function loadBackends() {
    try {
        showLoading(true);
        
        const response = await PlatformAPI.get('/merchant-backends?populate=merchant');
        const backends = response.data;
        
        const tbody = document.querySelector('#backends-table tbody');
        
        if (!backends || backends.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Aucun backend</td></tr>';
            showLoading(false);
            return;
        }
        
        tbody.innerHTML = backends.map(backend => `
            <tr>
                <td>${backend.merchant?.name || 'N/A'}</td>
                <td>
                    <a href="${backend.apiEndpoint}" target="_blank">
                        ${backend.subdomain}
                    </a>
                </td>
                <td>
                    <span class="badge ${getBackendStatusColor(backend.status)} badge-custom">
                        ${backend.status}
                    </span>
                </td>
                <td>${backend.version}</td>
                <td>
                    <span class="badge ${getHealthStatusColor(backend.healthStatus)} badge-custom">
                        ${backend.healthStatus}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewBackend(${backend.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="restartBackend(${backend.id})">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur chargement backends:', error);
        NotificationManager.show('Erreur lors du chargement des backends', 'error');
        showLoading(false);
    }
}

async function loadPlans() {
    try {
        showLoading(true);
        
        const response = await PlatformAPI.get('/subscription-plans');
        const plans = response.data;
        
        const container = document.getElementById('plans-container');
        
        if (!plans || plans.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-center text-muted">Aucun plan</p></div>';
            showLoading(false);
            return;
        }
        
        container.innerHTML = plans.map(plan => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-header text-center">
                        <h5>${plan.name}</h5>
                        <h3 class="text-primary">${plan.price}€<small class="text-muted">/${plan.billingPeriod}</small></h3>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li><i class="bi bi-check text-success"></i> ${plan.maxProducts === -1 ? 'Produits illimités' : `${plan.maxProducts} produits`}</li>
                            <li><i class="bi bi-check text-success"></i> ${plan.maxOrders === -1 ? 'Commandes illimitées' : `${plan.maxOrders} commandes`}</li>
                            <li><i class="bi bi-check text-success"></i> ${plan.maxStorage}MB de stockage</li>
                            <li><i class="bi bi-${plan.customDomain ? 'check text-success' : 'x text-danger'}"></i> Domaine personnalisé</li>
                            <li><i class="bi bi-${plan.prioritySupport ? 'check text-success' : 'x text-danger'}"></i> Support prioritaire</li>
                        </ul>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="editPlan(${plan.id})">
                            <i class="bi bi-pencil"></i> Modifier
                        </button>
                        <span class="badge ${plan.isActive ? 'bg-success' : 'bg-secondary'} badge-custom">
                            ${plan.isActive ? 'Actif' : 'Inactif'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Peupler le select des plans dans le modal onboarding
        const planSelect = document.getElementById('plan-select');
        planSelect.innerHTML = '<option value="">Sélectionner un plan</option>' + 
            plans.filter(plan => plan.isActive).map(plan => 
                `<option value="${plan.id}">${plan.name} (${plan.price}€/${plan.billingPeriod})</option>`
            ).join('');
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur chargement plans:', error);
        NotificationManager.show('Erreur lors du chargement des plans', 'error');
        showLoading(false);
    }
}

function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'merchants':
            loadMerchants();
            break;
        case 'subscriptions':
            loadSubscriptions();
            break;
        case 'support':
            loadSupportTickets();
            break;
        case 'backends':
            loadBackends();
            break;
        case 'plans':
            loadPlans();
            break;
    }
}

// Fonctions utilitaires
function showLoading(show) {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR');
}

function getBusinessTypeLabel(type) {
    const labels = {
        commerce: 'Commerce',
        artisanat: 'Artisanat',
        service: 'Service',
        restauration: 'Restauration'
    };
    return labels[type] || type;
}

function getSubscriptionStatusColor(status) {
    const colors = {
        active: 'bg-success',
        trialing: 'bg-info',
        pending: 'bg-warning',
        cancelled: 'bg-danger',
        inactive: 'bg-secondary'
    };
    return colors[status] || 'bg-secondary';
}

function getBackendStatusColor(status) {
    const colors = {
        active: 'bg-success',
        deploying: 'bg-warning',
        error: 'bg-danger',
        maintenance: 'bg-info',
        suspended: 'bg-secondary'
    };
    return colors[status] || 'bg-secondary';
}

function getHealthStatusColor(status) {
    const colors = {
        healthy: 'bg-success',
        warning: 'bg-warning',
        critical: 'bg-danger'
    };
    return colors[status] || 'bg-secondary';
}

function getPriorityColor(priority) {
    const colors = {
        low: 'bg-secondary',
        medium: 'bg-info',
        high: 'bg-warning',
        urgent: 'bg-danger'
    };
    return colors[priority] || 'bg-secondary';
}

function getTicketStatusColor(status) {
    const colors = {
        open: 'bg-warning',
        in_progress: 'bg-info',
        waiting_customer: 'bg-secondary',
        resolved: 'bg-success',
        closed: 'bg-dark'
    };
    return colors[status] || 'bg-secondary';
}

// Actions
function refreshData() {
    loadSectionData(currentSection);
    NotificationManager.show('Données actualisées', 'success');
}

function showCreateModal() {
    // Logique pour afficher un modal de création selon la section
    switch(currentSection) {
        case 'merchants':
            showOnboardingModal();
            break;
        case 'plans':
            showPlanModal();
            break;
        default:
            NotificationManager.show('Fonctionnalité non implémentée', 'info');
    }
}

function showOnboardingModal() {
    const modal = new bootstrap.Modal(document.getElementById('onboardingModal'));
    modal.show();
}

async function submitOnboarding() {
    try {
        const form = document.getElementById('onboardingForm');
        const formData = new FormData(form);
        
        const merchantData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            address: formData.get('address'),
            businessType: formData.get('businessType'),
            isActive: true
        };
        
        const onboardingData = {
            merchantData,
            planId: formData.get('planId') || null,
            subdomain: formData.get('subdomain') || null
        };
        
        const response = await PlatformAPI.post('/platform/onboard-merchant', { data: onboardingData });
        
        NotificationManager.show('Commerçant créé avec succès !', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('onboardingModal'));
        modal.hide();
        
        form.reset();
        
        // Recharger les données si on est sur la section merchants
        if (currentSection === 'merchants') {
            loadMerchants();
        }
        
    } catch (error) {
        console.error('Erreur onboarding:', error);
        NotificationManager.show('Erreur lors de la création du commerçant', 'error');
    }
}

// Actions spécifiques
function viewMerchantDetails(merchantId) {
    NotificationManager.show('Redirection vers les détails...', 'info');
    // Rediriger vers une page de détails ou ouvrir un modal
}

function editMerchant(merchantId) {
    NotificationManager.show('Édition non implémentée', 'info');
}

function viewSubscription(subscriptionId) {
    NotificationManager.show('Détails de l\'abonnement...', 'info');
}

async function cancelSubscription(subscriptionId) {
    if (!confirm('Êtes-vous sûr de vouloir annuler cet abonnement ?')) {
        return;
    }
    
    try {
        await PlatformAPI.put(`/subscriptions/${subscriptionId}/cancel`, { reason: 'Annulation administrative' });
        NotificationManager.show('Abonnement annulé', 'success');
        loadSubscriptions();
    } catch (error) {
        NotificationManager.show('Erreur lors de l\'annulation', 'error');
    }
}

function viewTicket(ticketId) {
    NotificationManager.show('Redirection vers le ticket...', 'info');
}

function assignTicket(ticketId) {
    NotificationManager.show('Attribution de ticket non implémentée', 'info');
}

function viewBackend(backendId) {
    NotificationManager.show('Détails du backend...', 'info');
}

async function restartBackend(backendId) {
    if (!confirm('Êtes-vous sûr de vouloir redémarrer ce backend ?')) {
        return;
    }
    
    try {
        await PlatformAPI.post(`/merchant-backends/${backendId}/restart`);
        NotificationManager.show('Redémarrage initié', 'success');
        loadBackends();
    } catch (error) {
        NotificationManager.show('Erreur lors du redémarrage', 'error');
    }
}

function editPlan(planId) {
    NotificationManager.show('Édition de plan non implémentée', 'info');
}

function showPlanModal() {
    NotificationManager.show('Création de plan non implémentée', 'info');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de l\'administration plateforme');
    
    // Charger le dashboard par défaut
    loadDashboard();
    
    // Charger les plans pour le modal d'onboarding
    loadPlans();
});
