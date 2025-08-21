// Définition des types globaux pour éviter les erreurs TypeScript
/* global bootstrap */

// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:1337/api',
    timeout: 10000
};

// API Manager
class MarketplaceAPI {
    static async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    static async get(endpoint, params = {}) {
        const searchParams = new URLSearchParams(params);
        const url = `${endpoint}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        return this.request(url);
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify({ data })
        });
    }

    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify({ data })
        });
    }

    static async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Notification Manager
class NotificationManager {
    static show(message, type = 'info', duration = 5000) {
        // Supprimer les anciennes notifications
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Créer la nouvelle notification
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        // Ajouter au conteneur
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1055';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        // Initialiser et afficher
        if (typeof bootstrap !== 'undefined') {
            const toastInstance = new bootstrap.Toast(toast, { delay: duration });
            toastInstance.show();
        }
    }
}

// Cart Manager
class CartManager {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('marketplace_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('marketplace_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier:', error);
        }
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += Number(quantity);
        } else {
            this.items.push({
                product: product,
                quantity: Number(quantity)
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        NotificationManager.show(`${product.name} ajouté au panier`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = Number(newQuantity);
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    updateCartUI() {
        // Mettre à jour le badge du panier
        const cartBadge = document.getElementById('cartCount');
        if (cartBadge) {
            const totalItems = this.getTotalItems();
            cartBadge.textContent = totalItems.toString();
            cartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
        }

        // Mettre à jour le contenu du panier
        this.updateCartModal();
    }

    updateCartModal() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-muted text-center py-4">Votre panier est vide</p>';
            if (cartTotal) cartTotal.textContent = '0.00€';
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item border-bottom pb-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-3">
                        <img src="${item.product.image || '/placeholder-product.jpg'}" 
                             alt="${item.product.name}" 
                             class="img-fluid rounded">
                    </div>
                    <div class="col-6">
                        <h6 class="mb-1">${item.product.name}</h6>
                        <small class="text-muted">${item.product.price}€</small>
                    </div>
                    <div class="col-3">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary" 
                                    onclick="updateCartQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                            <input type="text" class="form-control text-center" 
                                   value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary" 
                                    onclick="updateCartQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="btn btn-sm btn-outline-danger mt-1 w-100" 
                                onclick="removeFromCart(${item.product.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        if (cartTotal) {
            cartTotal.textContent = this.getTotalPrice().toFixed(2) + '€';
        }
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }
}

// Variables globales
let cart;
let allMerchants = [];
let allProducts = [];
let allCategories = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    cart = new CartManager();
    loadMarketplaceData();
    setupEventListeners();
});

// Chargement des données
async function loadMarketplaceData() {
    try {
        // Afficher les indicateurs de chargement
        showLoadingStates();

        // Charger toutes les données en parallèle
        const [merchantsData, productsData, categoriesData] = await Promise.all([
            MarketplaceAPI.get('/merchants?populate=*'),
            MarketplaceAPI.get('/products?populate=*'),
            MarketplaceAPI.get('/categories?populate=*')
        ]);

        // Stocker les données
        allMerchants = merchantsData.data || [];
        allProducts = productsData.data || [];
        allCategories = categoriesData.data || [];

        // Afficher les données
        displayMerchants(allMerchants);
        displayProducts(allProducts);
        displayCategories(allCategories);
        updateStats();

    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        NotificationManager.show('Erreur lors du chargement des données', 'error');
    }
}

function showLoadingStates() {
    const loadingHTML = '<div class="text-center py-4"><div class="spinner-border" role="status"></div></div>';
    
    const containers = ['merchantsContainer', 'productsContainer', 'categoriesContainer'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = loadingHTML;
    });
}

// Affichage des commerçants
function displayMerchants(merchants) {
    const container = document.getElementById('merchantsContainer');
    if (!container) return;

    if (!merchants || merchants.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Aucun commerçant trouvé</p>';
        return;
    }

    container.innerHTML = merchants.map(merchant => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card merchant-card h-100 shadow-sm" onclick="viewMerchant(${merchant.id})">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="merchant-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style="width: 50px; height: 50px;">
                            ${merchant.name ? merchant.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div>
                            <h5 class="card-title mb-1">${merchant.name || 'Nom non disponible'}</h5>
                            <small class="text-muted">
                                <i class="bi bi-geo-alt"></i>
                                ${merchant.city || 'Ville non renseignée'}
                            </small>
                        </div>
                    </div>
                    
                    <p class="card-text">${merchant.description || 'Description non disponible'}</p>
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-success">${merchant.category || 'Commerce'}</span>
                        <div class="text-warning">
                            ${'★'.repeat(Math.floor(merchant.rating || 4))}${'☆'.repeat(5 - Math.floor(merchant.rating || 4))}
                            <small class="text-muted">(${merchant.rating || '4.0'})</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Affichage des produits
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Aucun produit trouvé</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card product-card h-100 shadow-sm">
                <img src="${product.image || '/placeholder-product.jpg'}" 
                     class="card-img-top" alt="${product.name}"
                     style="height: 200px; object-fit: cover;"
                     onclick="viewProduct(${product.id})">
                
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name || 'Produit sans nom'}</h5>
                    <p class="card-text flex-grow-1">${product.description || 'Description non disponible'}</p>
                    
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="h5 text-primary mb-0">${product.price || 0}€</span>
                        <span class="badge bg-light text-dark">${product.category?.name || 'Catégorie'}</span>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary flex-grow-1" onclick="viewProduct(${product.id})">
                            <i class="bi bi-eye"></i> Voir
                        </button>
                        <button class="btn btn-primary" onclick="addToCartQuick(${product.id})">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Affichage des catégories
function displayCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;

    if (!categories || categories.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Aucune catégorie trouvée</p>';
        return;
    }

    container.innerHTML = categories.map(category => `
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="card category-card text-center h-100 shadow-sm" 
                 onclick="filterByCategory('${category.name}')"
                 style="cursor: pointer;">
                <div class="card-body">
                    <i class="bi ${category.icon || 'bi-tag'} display-6 text-primary mb-3"></i>
                    <h6 class="card-title">${category.name || 'Catégorie'}</h6>
                    <small class="text-muted">${category.products?.length || 0} produits</small>
                </div>
            </div>
        </div>
    `).join('');
}

// Configuration des événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterContent(query);
        });
    }

    // Formulaire de commerçant
    const merchantForm = document.getElementById('merchantForm');
    if (merchantForm) {
        merchantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createMerchant();
        });
    }

    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
}

// Fonctions d'interaction
async function createMerchant() {
    const form = document.getElementById('merchantForm');
    if (!form) return;

    const formData = new FormData(form);
    
    const merchantData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        description: formData.get('description'),
        category: formData.get('category'),
        isActive: false
    };

    try {
        const result = await MarketplaceAPI.post('/merchants', merchantData);
        
        NotificationManager.show('Votre boutique a été créée avec succès ! Vous recevrez un email de confirmation.', 'success');
        
        // Fermer le modal
        if (typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerMerchantModal'));
            if (modal) modal.hide();
        }
        
        // Réinitialiser le formulaire
        if (form.reset) form.reset();
        
        // Recharger les données
        loadMarketplaceData();
        
    } catch (error) {
        console.error('Erreur lors de la création:', error);
        NotificationManager.show('Erreur lors de la création de votre boutique. Veuillez réessayer.', 'error');
    }
}

async function submitContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    if (!nameInput || !emailInput || !messageInput) return;

    const contactData = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value,
        createdAt: new Date().toISOString()
    };

    try {
        // Ici vous pourriez envoyer à un service de contact
        console.log('Message de contact:', contactData);
        
        NotificationManager.show('Votre message a été envoyé avec succès !', 'success');
        
        // Fermer le modal
        if (typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            if (modal) modal.hide();
        }
        
        // Réinitialiser le formulaire
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        NotificationManager.show('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
    }
}

// Fonctions de filtrage et recherche
function filterContent(query) {
    if (!query) {
        displayMerchants(allMerchants);
        displayProducts(allProducts);
        return;
    }

    // Filtrer les commerçants
    const filteredMerchants = allMerchants.filter(merchant => 
        (merchant.name && merchant.name.toLowerCase().includes(query)) ||
        (merchant.description && merchant.description.toLowerCase().includes(query)) ||
        (merchant.city && merchant.city.toLowerCase().includes(query))
    );

    // Filtrer les produits
    const filteredProducts = allProducts.filter(product => 
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query))
    );

    displayMerchants(filteredMerchants);
    displayProducts(filteredProducts);
}

function filterByCategory(categoryName) {
    const filteredProducts = allProducts.filter(product => 
        product.category && product.category.name === categoryName
    );
    
    displayProducts(filteredProducts);
    
    // Scroll vers les produits
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Fonctions du panier
function addToCartQuick(productId) {
    const product = allProducts.find(p => p.id === Number(productId));
    if (product && cart) {
        cart.addItem(product, 1);
    }
}

function updateCartQuantity(productId, newQuantity) {
    if (cart) {
        cart.updateQuantity(Number(productId), Number(newQuantity));
    }
}

function removeFromCart(productId) {
    if (cart) {
        cart.removeItem(Number(productId));
    }
}

// Fonctions de visualisation
function viewProduct(productId) {
    const product = allProducts.find(p => p.id === Number(productId));
    if (!product) return;

    // Remplir le modal produit
    const modal = document.getElementById('productModal');
    if (modal) {
        const title = modal.querySelector('.modal-title');
        const image = modal.querySelector('#productModalImage');
        const description = modal.querySelector('#productModalDescription');
        const price = modal.querySelector('#productModalPrice');
        const quantityInput = modal.querySelector('#productQuantity');

        if (title) title.textContent = product.name || 'Produit';
        if (image) {
            image.src = product.image || '/placeholder-product.jpg';
            image.alt = product.name || 'Produit';
        }
        if (description) description.textContent = product.description || 'Description non disponible';
        if (price) price.textContent = `${product.price || 0}€`;
        if (quantityInput) quantityInput.value = '1';

        // Configurer le bouton d'ajout au panier
        const addToCartBtn = modal.querySelector('#addToCartFromModal');
        if (addToCartBtn) {
            addToCartBtn.onclick = function() {
                const quantity = quantityInput ? Number(quantityInput.value) : 1;
                if (cart) {
                    cart.addItem(product, quantity);
                    if (typeof bootstrap !== 'undefined') {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) modalInstance.hide();
                    }
                }
            };
        }

        // Afficher le modal
        if (typeof bootstrap !== 'undefined') {
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        }
    }
}

function viewMerchant(merchantId) {
    const merchant = allMerchants.find(m => m.id === Number(merchantId));
    if (!merchant) return;

    // Remplir le modal commerçant
    const modal = document.getElementById('merchantModal');
    if (modal) {
        const title = modal.querySelector('.modal-title');
        const description = modal.querySelector('#merchantModalDescription');
        const address = modal.querySelector('#merchantModalAddress');
        const phone = modal.querySelector('#merchantModalPhone');
        const email = modal.querySelector('#merchantModalEmail');

        if (title) title.textContent = merchant.name || 'Commerçant';
        if (description) description.textContent = merchant.description || 'Description non disponible';
        if (address) address.textContent = `${merchant.address || ''}, ${merchant.city || ''}`;
        if (phone) phone.textContent = merchant.phone || 'Non renseigné';
        if (email) email.textContent = merchant.email || 'Non renseigné';

        // Afficher les produits du commerçant
        const merchantProducts = allProducts.filter(product => 
            product.merchant && product.merchant.id === merchant.id
        );

        const productsContainer = modal.querySelector('#merchantProducts');
        if (productsContainer) {
            if (merchantProducts.length === 0) {
                productsContainer.innerHTML = '<p class="text-muted">Aucun produit disponible</p>';
            } else {
                productsContainer.innerHTML = merchantProducts.map(product => `
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <img src="${product.image || '/placeholder-product.jpg'}" 
                                 class="card-img-top" alt="${product.name}"
                                 style="height: 150px; object-fit: cover;">
                            <div class="card-body">
                                <h6 class="card-title">${product.name}</h6>
                                <p class="card-text small">${product.description || ''}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-primary fw-bold">${product.price}€</span>
                                    <button class="btn btn-sm btn-primary" onclick="addToCartQuick(${product.id})">
                                        <i class="bi bi-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Afficher le modal
        if (typeof bootstrap !== 'undefined') {
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        }
    }
}

// Mise à jour des statistiques
function updateStats() {
    const statsElements = {
        merchantsCount: document.getElementById('merchantsCount'),
        productsCount: document.getElementById('productsCount'),
        categoriesCount: document.getElementById('categoriesCount')
    };

    if (statsElements.merchantsCount) {
        statsElements.merchantsCount.textContent = allMerchants.length.toString();
    }
    if (statsElements.productsCount) {
        statsElements.productsCount.textContent = allProducts.length.toString();
    }
    if (statsElements.categoriesCount) {
        statsElements.categoriesCount.textContent = allCategories.length.toString();
    }
}

// Exportation pour l'accès global
if (typeof window !== 'undefined') {
    window.CartManager = CartManager;
    window.viewProduct = viewProduct;
    window.addToCartQuick = addToCartQuick;
    window.updateCartQuantity = updateCartQuantity;
    window.filterByCategory = filterByCategory;
    window.viewMerchant = viewMerchant;
}
