/**
 * Gestionnaire d'authentification pour la marketplace
 */
class AuthManager {
    constructor() {
        this.selectedRole = 'customer';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Gestionnaires pour les boutons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('Bouton de connexion cliqué');
                this.handleLogin();
            });
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                console.log('Bouton d\'inscription cliqué');
                this.handleRegister();
            });
        }

        // Basculer entre connexion et inscription
        const showRegisterLink = document.getElementById('showRegister');
        const showLoginLink = document.getElementById('showLogin');
        
        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }
        
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        // Sélection du rôle
        document.querySelectorAll('.role-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.selectedRole = option.dataset.role;
            });
        });

        // Soumission des formulaires
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Vérifier si déjà connecté
        this.checkExistingAuth();
    }

    showLoginForm() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        this.hideAlert();
    }

    showRegisterForm() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        this.hideAlert();
    }

    showAlert(message, type = 'error') {
        const alertDiv = document.getElementById('alert');
        alertDiv.textContent = message;
        alertDiv.className = `alert ${type}`;
        alertDiv.style.display = 'block';

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => this.hideAlert(), 3000);
        }
    }

    hideAlert() {
        document.getElementById('alert').style.display = 'none';
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    async handleLogin() {
        console.log('🔐 handleLogin appelée');
        try {
            this.showLoading();
            this.hideAlert();

            const formData = new FormData(document.getElementById('loginFormElement'));
            const data = {
                identifier: formData.get('identifier'),
                password: formData.get('password')
            };

            console.log('Données de connexion:', { identifier: data.identifier, password: '***' });

            if (!data.identifier || !data.password) {
                this.showAlert('Veuillez remplir tous les champs');
                return;
            }

            console.log('Envoi de la requête de connexion...');
            const response = await fetch('/api/auth/local', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Réponse reçue:', response.status, response.statusText);
            const result = await response.json();
            console.log('Résultat:', result);

            if (response.ok) {
                // Stocker le token
                localStorage.setItem('auth_token', result.jwt);
                localStorage.setItem('user_data', JSON.stringify(result.user));

                this.showAlert('Connexion réussie ! Redirection...', 'success');
                
                // Rediriger selon le rôle
                setTimeout(() => {
                    const role = result.user.role?.type;
                    let redirectUrl = '/marketplace/';
                    
                    switch (role) {
                        case 'super-admin':
                            redirectUrl = '/marketplace/platform-admin.html';
                            break;
                        case 'commercial':
                            redirectUrl = '/marketplace/commercial-dashboard.html';
                            break;
                        case 'merchant':
                            redirectUrl = '/marketplace/merchant-dashboard.html';
                            break;
                        case 'customer':
                            redirectUrl = '/marketplace/customer-dashboard.html';
                            break;
                    }
                    
                    console.log('Redirection vers:', redirectUrl);
                    window.location.href = redirectUrl;
                }, 1500);

            } else {
                this.showAlert(result.error?.message || 'Identifiants incorrects');
            }

        } catch (error) {
            console.error('Erreur de connexion:', error);
            this.showAlert('Erreur de connexion au serveur');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister() {
        console.log('📝 handleRegister appelée');
        try {
            this.showLoading();
            this.hideAlert();

            const formData = new FormData(document.getElementById('registerFormElement'));
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: this.selectedRole
            };

            console.log('Données d\'inscription:', { ...data, password: '***' });

            if (!data.username || !data.email || !data.password) {
                this.showAlert('Veuillez remplir tous les champs');
                return;
            }

            if (data.password.length < 8) {
                this.showAlert('Le mot de passe doit contenir au moins 8 caractères');
                return;
            }

            console.log('Envoi de la requête d\'inscription...');
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Réponse reçue:', response.status, response.statusText);
            const result = await response.json();
            console.log('Résultat:', result);

            if (response.ok) {
                // Stocker le token
                localStorage.setItem('auth_token', result.jwt);
                localStorage.setItem('user_data', JSON.stringify(result.user));

                this.showAlert('Inscription réussie ! Redirection...', 'success');
                
                // Rediriger selon le rôle
                setTimeout(() => {
                    const role = result.user.role?.type;
                    let redirectUrl = '/marketplace/';
                    
                    if (role === 'merchant') {
                        redirectUrl = '/marketplace/merchant-dashboard.html';
                    } else if (role === 'customer') {
                        redirectUrl = '/marketplace/customer-dashboard.html';
                    }
                    
                    console.log('Redirection vers:', redirectUrl);
                    window.location.href = redirectUrl;
                }, 1500);

            } else {
                this.showAlert(result.error?.message || 'Erreur lors de l\'inscription');
            }

        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            this.showAlert('Erreur de connexion au serveur');
        } finally {
            this.hideLoading();
        }
    }

    checkExistingAuth() {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                const role = user.role?.type;

                // Rediriger automatiquement si déjà connecté
                let redirectUrl = '/marketplace/';
                
                switch (role) {
                    case 'super-admin':
                        redirectUrl = '/marketplace/platform-admin.html';
                        break;
                    case 'commercial':
                        redirectUrl = '/marketplace/commercial-dashboard.html';
                        break;
                    case 'merchant':
                        redirectUrl = '/marketplace/merchant-dashboard.html';
                        break;
                    case 'customer':
                        redirectUrl = '/marketplace/customer-dashboard.html';
                        break;
                }

                // Vérifier si le token est encore valide
                fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    if (response.ok) {
                        window.location.href = redirectUrl;
                    } else {
                        // Token expiré, le supprimer
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_data');
                    }
                });

            } catch (error) {
                console.error('Erreur parsing user data:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
            }
        }
    }
}

// Initialiser l'authentification quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    console.log('AuthManager initialisé:', window.authManager);
});
