// Configuration
const API_URL = 'http://localhost:1337/api';
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('marketplace_cart') || '[]');
let categories = [];
let currentProduct = null;

// Classes utilitaires
class MarketplaceAPI {
    static async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint);
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify({ data })
        });
    }
}

class NotificationManager {
    static show(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        const id = 'notification_' + Date.now();
        
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `alert alert-${type} alert-dismissible fade show notification animate__animated animate__fadeInRight`;
        notification.innerHTML = `
            <strong>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</strong>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.getElementById(id)) {
                notification.classList.remove('animate__fadeInRight');
                notification.classList.add('animate__fadeOutRight');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);
    }
}

class CartManager {
    static addItem(product, quantity = 1) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                merchant: product.merchant
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        NotificationManager.show(`${product.name} ajouté au panier !`);
    }

    static removeItem(productId) {
        cart = cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    static updateQuantity(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    static getTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    static saveCart() {
        localStorage.setItem('marketplace_cart', JSON.stringify(cart));
    }

    static updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('d-none');
        } else {
            cartCount.classList.add('d-none');
        }
    }

    static displayCart() {
        const cartBody = document.getElementById('cartModalBody');
        
        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h4 class="mt-3">Votre panier est vide</h4>
                    <p class="text-muted">Découvrez nos produits locaux et ajoutez-les à votre panier !</p>
                </div>
            `;
            return;
        }

        cartBody.innerHTML = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.map(item => `
                            <tr>
                                <td>
                                    <strong>${item.name}</strong><br>
                                    <small class="text-muted">${item.merchant?.name || 'Commerçant'}</small>
                                </td>
                                <td>${item.price}€</td>
                                <td>
                                    <div class="input-group" style="width: 120px;">
                                        <button class="btn btn-outline-secondary btn-sm" onclick="CartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                        <input type="number" class="form-control form-control-sm text-center" value="${item.quantity}" readonly>
                                        <button class="btn btn-outline-secondary btn-sm" onclick="CartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                    </div>
                                </td>
                                <td><strong>${(item.price * item.quantity).toFixed(2)}€</strong></td>
                                <td>
                                    <button class="btn btn-outline-danger btn-sm" onclick="CartManager.removeItem('${item.id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="table-dark">
                            <th colspan="3">Total</th>
                            <th><strong>${this.getTotal().toFixed(2)}€</strong></th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
}

// Fonctions principales
async function loadMarketplaceData() {
    try {
        showLoading(true);
        
        // Charger les données en parallèle
        const [marketplaceData, categoriesData] = await Promise.all([
            MarketplaceAPI.get('/marketplace'),
            MarketplaceAPI.get('/categories?populate=icon')
        ]);

        const data = marketplaceData.data;
        categories = categoriesData.data;

        // Afficher les données
        displayStats(data.stats);
        displayCategories(categories);
        displayMerchants(data.recentMerchants);
        displayProducts(data.featuredProducts);
        
        // Remplir le filtre de catégories
        populateCategoryFilter();
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showError('Impossible de charger les données. Vérifiez que Strapi fonctionne.');
        showLoading(false);
    }
}

function displayStats(stats) {
    const container = document.getElementById('statsContainer');
    if (!stats) return;
    
    container.innerHTML = `
        <div class="col-md-3 mb-3">
            <div class="card stats-card animate__animated animate__fadeInUp">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-shop display-4 me-3"></i>
                        <div>
                            <h3 class="mb-0">${stats.totalMerchants || 0}</h3>
                            <p class="mb-0">Commerçants</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stats-card animate__animated animate__fadeInUp animate__delay-1s">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-box display-4 me-3"></i>
                        <div>
                            <h3 class="mb-0">${stats.totalProducts || 0}</h3>
                            <p class="mb-0">Produits</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stats-card animate__animated animate__fadeInUp animate__delay-2s">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-cart-check display-4 me-3"></i>
                        <div>
                            <h3 class="mb-0">${stats.totalOrders || 0}</h3>
                            <p class="mb-0">Commandes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stats-card animate__animated animate__fadeInUp animate__delay-3s">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-tags display-4 me-3"></i>
                        <div>
                            <h3 class="mb-0">${stats.totalCategories || 0}</h3>
                            <p class="mb-0">Catégories</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displayCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    if (!categories || categories.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucune catégorie disponible</p>';
        return;
    }
    
    container.innerHTML = categories.map((category, index) => `
        <span class="category-badge animate__animated animate__fadeIn" 
              style="background: ${category.color || '#3498db'}; animation-delay: ${index * 0.1}s"
              onclick="filterByCategory('${category.id}')">
            ${category.icon ? `<i class="${category.icon} me-2"></i>` : ''}
            ${category.name}
        </span>
    `).join('');
}

function displayMerchants(merchants) {
    const container = document.getElementById('merchantsContainer');
    if (!merchants || merchants.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center text-muted">Aucun commerçant disponible</p></div>';
        return;
    }
    
    container.innerHTML = merchants.map((merchant, index) => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card merchant-card h-100 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
                ${merchant.logo ? `
                    <div class="card-img-top" style="height: 200px; background-image: url('${API_URL}${merchant.logo.url}'); background-size: cover; background-position: center;"></div>
                ` : `
                    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                        <i class="bi bi-shop display-3 text-muted"></i>
                    </div>
                `}
                <div class="merchant-status ${isOpenNow() ? 'status-open' : 'status-closed'}">
                    ${isOpenNow() ? 'Ouvert' : 'Fermé'}
                </div>
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <i class="bi bi-shop-window me-2 text-primary"></i>
                        <h5 class="card-title mb-0">${merchant.name}</h5>
                    </div>
                    <p class="card-text text-muted small">
                        <i class="bi bi-geo-alt me-1"></i>
                        ${merchant.city || 'Ville non spécifiée'}
                    </p>
                    <p class="card-text">${truncateText(merchant.description || 'Aucune description', 100)}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="merchant-badge">${merchant.businessType}</span>
                        ${merchant.rating ? `
                            <div class="rating-stars">
                                ${generateStars(merchant.rating)}
                                <small class="text-muted">(${merchant.rating}/5)</small>
                            </div>
                        ` : ''}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-box me-1"></i>
                            ${merchant.products ? merchant.products.length : 0} produits
                        </small>
                        <button class="btn btn-primary btn-sm" onclick="viewMerchant('${merchant.id}')">
                            Voir la boutique
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center text-muted">Aucun produit en vedette</p></div>';
        return;
    }
    
    container.innerHTML = products.map((product, index) => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card product-card h-100 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
                ${product.images && product.images.length > 0 ? `
                    <div class="card-img-top" style="height: 200px; background-image: url('${API_URL}${product.images[0].url}'); background-size: cover; background-position: center; cursor: pointer;" onclick="viewProduct('${product.id}')"></div>
                ` : `
                    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px; cursor: pointer;" onclick="viewProduct('${product.id}')">
                        <i class="bi bi-image display-4 text-muted"></i>
                    </div>
                `}
                <div class="card-body">
                    <h6 class="card-title">${product.name}</h6>
                    <p class="card-text text-muted small mb-2">
                        <i class="bi bi-shop me-1"></i>
                        ${product.merchant ? product.merchant.name : 'Commerçant'}
                    </p>
                    ${product.category ? `
                        <span class="badge bg-secondary mb-2">${product.category.name}</span>
                    ` : ''}
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="price-tag">${product.price}€</span>
                            ${product.oldPrice ? `<small class="text-muted text-decoration-line-through ms-2">${product.oldPrice}€</small>` : ''}
                        </div>
                        ${product.isFeatured ? '<span class="badge bg-warning text-dark">Vedette</span>' : ''}
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="viewProduct('${product.id}')">
                            <i class="bi bi-eye me-1"></i> Voir
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="addToCartQuick('${product.id}')">
                            <i class="bi bi-cart-plus me-1"></i> Panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Fonctions d'interaction
async function createMerchant() {
    const form = document.getElementById('merchantForm');
    const formData = new FormData(form);
    
    const merchantData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        businessType: formData.get('businessType'),
        description: formData.get('description'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        website: formData.get('website'),
        isActive: true
    };

    try {
        const result = await MarketplaceAPI.post('/merchants', merchantData);
        
        NotificationManager.show('Votre boutique a été créée avec succès ! Vous recevrez un email de confirmation.', 'success');
        
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerMerchantModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        form.reset();
        
        // Recharger les données
        loadMarketplaceData();
        
    } catch (error) {
        console.error('Erreur lors de la création:', error);
        NotificationManager.show('Erreur lors de la création de votre boutique. Veuillez réessayer.', 'error');
    }
}

async function viewProduct(productId) {
    try {
        const result = await MarketplaceAPI.get(`/products/${productId}?populate=*`);
        const product = result.data;
        currentProduct = product;
        
        const modalTitle = document.getElementById('productModalTitle');
        const modalBody = document.getElementById('productModalBody');
        
        modalTitle.textContent = product.name;
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    ${product.images && product.images.length > 0 ? `
                        <img src="${API_URL}${product.images[0].url}" class="img-fluid rounded" alt="${product.name}">
                    ` : `
                        <div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 300px;">
                            <i class="bi bi-image display-1 text-muted"></i>
                        </div>
                    `}
                </div>
                <div class="col-md-6">
                    <h4>${product.name}</h4>
                    <p class="text-muted">
                        <i class="bi bi-shop me-2"></i>
                        ${product.merchant ? product.merchant.name : 'Commerçant'}
                    </p>
                    ${product.category ? `<span class="badge bg-primary mb-3">${product.category.name}</span>` : ''}
                    <p>${product.description || 'Aucune description disponible'}</p>
                    <div class="mb-3">
                        <span class="h3 text-primary">${product.price}€</span>
                        ${product.oldPrice ? `<span class="text-muted text-decoration-line-through ms-2">${product.oldPrice}€</span>` : ''}
                    </div>
                    ${product.stock ? `
                        <p class="text-muted">
                            <i class="bi bi-box me-2"></i>
                            Stock: ${product.stock} unités
                        </p>
                    ` : ''}
                    <div class="mb-3">
                        <label class="form-label">Quantité</label>
                        <div class="input-group" style="width: 120px;">
                            <button class="btn btn-outline-secondary" onclick="updateProductQuantity(-1)">-</button>
                            <input type="number" class="form-control text-center" id="productQuantity" value="1" min="1">
                            <button class="btn btn-outline-secondary" onclick="updateProductQuantity(1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
        
    } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        NotificationManager.show('Erreur lors du chargement du produit', 'error');
    }
}

async function addToCartQuick(productId) {
    try {
        const result = await MarketplaceAPI.get(`/products/${productId}?populate=merchant`);
        const product = result.data;
        CartManager.addItem(product);
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        NotificationManager.show('Erreur lors de l\'ajout au panier', 'error');
    }
}

function addToCartFromModal() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('productQuantity').value);
    CartManager.addItem(currentProduct, quantity);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
}

function updateProductQuantity(delta) {
    const input = document.getElementById('productQuantity');
    const newValue = parseInt(input.value) + delta;
    if (newValue >= 1) {
        input.value = newValue;
    }
}

// Fonctions de recherche
async function performSearch(query, filters = {}) {
    try {
        let endpoint = '/marketplace/search?';
        const params = new URLSearchParams();
        
        if (query) params.append('q', query);
        if (filters.city) params.append('city', filters.city);
        if (filters.type) params.append('type', filters.type);
        if (filters.category) params.append('category', filters.category);
        
        endpoint += params.toString();
        
        const result = await MarketplaceAPI.get(endpoint);
        displaySearchResults(result.data, result.meta);
        
    } catch (error) {
        console.error('Erreur de recherche:', error);
        NotificationManager.show('Erreur lors de la recherche', 'error');
    }
}

function displaySearchResults(results, meta) {
    const section = document.getElementById('searchResults');
    const container = document.getElementById('searchResultsContainer');
    
    section.classList.remove('d-none');
    
    container.innerHTML = `
        <div class="mb-4">
            <h4>Recherche: "${meta.query || 'Recherche avancée'}"</h4>
            <p class="text-muted">${meta.merchantsCount || 0} commerçants, ${meta.productsCount || 0} produits trouvés</p>
        </div>
        
        ${results.merchants && results.merchants.length > 0 ? `
            <h5 class="mb-3">Commerçants</h5>
            <div class="row mb-4">
                ${results.merchants.map(merchant => `
                    <div class="col-md-6 mb-3">
                        <div class="card merchant-card">
                            <div class="card-body">
                                <h6>${merchant.name}</h6>
                                <p class="text-muted small mb-2">
                                    <i class="bi bi-geo-alt me-1"></i>
                                    ${merchant.city || ''}
                                </p>
                                <p class="small">${truncateText(merchant.description || '', 100)}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="merchant-badge">${merchant.businessType}</span>
                                    <button class="btn btn-primary btn-sm" onclick="viewMerchant('${merchant.id}')">
                                        Voir boutique
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${results.products && results.products.length > 0 ? `
            <h5 class="mb-3">Produits</h5>
            <div class="row">
                ${results.products.map(product => `
                    <div class="col-md-4 mb-3">
                        <div class="card product-card">
                            <div class="card-body">
                                <h6>${product.name}</h6>
                                <p class="text-muted small">${product.merchant ? product.merchant.name : ''}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="price-tag">${product.price}€</span>
                                    <button class="btn btn-primary btn-sm" onclick="viewProduct('${product.id}')">
                                        Voir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${(!results.merchants || results.merchants.length === 0) && (!results.products || results.products.length === 0) ? `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h4 class="mt-3">Aucun résultat trouvé</h4>
                <p class="text-muted">Essayez avec d'autres mots-clés ou affinez vos filtres</p>
            </div>
        ` : ''}
    `;
    
    // Scroller vers les résultats
    section.scrollIntoView({ behavior: 'smooth' });
}

// Fonctions utilitaires
function populateCategoryFilter() {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="">Toutes catégories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function filterByCategory(categoryId) {
    performSearch('', { category: categoryId });
}

function viewMerchant(merchantId) {
    // Rediriger vers la page détaillée du commerçant
    NotificationManager.show('Redirection vers la boutique...', 'info');
    // Ici vous pourriez implémenter une page dédiée au commerçant
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star"></i>';
    }
    
    return stars;
}

function isOpenNow() {
    // Logique simple pour déterminer si ouvert (peut être améliorée)
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour <= 19; // Ouvert de 8h à 19h
}

function showLoading(show) {
    // Afficher/masquer un indicateur de chargement
    const containers = ['statsContainer', 'categoriesContainer', 'merchantsContainer', 'productsContainer'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            if (show) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Chargement...</span>
                        </div>
                        <p class="mt-3 text-muted">Chargement en cours...</p>
                    </div>
                `;
            }
        }
    });
}

function showError(message) {
    const containers = ['statsContainer', 'categoriesContainer', 'merchantsContainer', 'productsContainer'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        ${message}
                    </div>
                </div>
            `;
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Charger les données
    loadMarketplaceData();
    
    // Initialiser le panier
    CartManager.updateCartUI();
    
    // Recherche simple
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const query = document.getElementById('searchInput').value;
        if (query.trim()) {
            performSearch(query);
        }
    });
    
    // Recherche avancée
    document.getElementById('advancedSearchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const filters = {
            city: document.getElementById('cityFilter').value,
            type: document.getElementById('businessTypeFilter').value,
            category: document.getElementById('categoryFilter').value
        };
        performSearch('', filters);
    });
    
    // Soumission du formulaire commerçant
    document.getElementById('submitMerchant').addEventListener('click', createMerchant);
    
    // Ajout au panier depuis le modal produit
    document.getElementById('addToCart').addEventListener('click', addToCartFromModal);
    
    // Affichage du panier
    document.getElementById('cartBtn').addEventListener('click', function() {
        CartManager.displayCart();
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();
    });
    
    // Commande
    document.getElementById('proceedToCheckout').addEventListener('click', function() {
        if (cart.length === 0) {
            NotificationManager.show('Votre panier est vide', 'warning');
            return;
        }
        
        // Ici vous pourriez implémenter le processus de commande
        NotificationManager.show('Fonctionnalité de commande en cours de développement...', 'info');
    });
    
    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Exposer les fonctions globalement pour les onclick
window.CartManager = CartManager;
window.viewProduct = viewProduct;
window.addToCartQuick = addToCartQuick;
window.updateProductQuantity = updateProductQuantity;
window.filterByCategory = filterByCategory;
window.viewMerchant = viewMerchant;
