# 🔐 Système d'Authentification et Gestion des Rôles - Localement Vôtre

## 🎯 Vue d'ensemble

Système d'authentification complet avec **4 niveaux d'accès** pour une marketplace multi-tenant :

### 👥 **Rôles Utilisateurs**

#### 1. **Super Admin** (`super-admin`)
- 🎯 **Qui** : Administrateurs de la plateforme
- 🔓 **Accès** : Accès complet à toute la plateforme
- 🖥️ **Dashboard** : `/marketplace/platform-admin.html`
- 🛠️ **Permissions** :
  - Gestion des commerçants et abonnements
  - Supervision de tous les backends
  - Gestion des commerciaux
  - Analytics globales de la plateforme
  - Support niveau 3

#### 2. **Commercial** (`commercial`)
- 🎯 **Qui** : Équipe commerciale/vente
- 🔓 **Accès** : Prospection, onboarding, suivi des ventes
- 🖥️ **Dashboard** : `/marketplace/commercial-dashboard.html`
- 🛠️ **Permissions** :
  - Gestion des prospects (leads)
  - Onboarding complet des commerçants
  - Démonstrations et présentations
  - Suivi des conversions et CA
  - Accès aux statistiques de vente

#### 3. **Merchant** (`merchant`)
- 🎯 **Qui** : Commerçants/Artisans
- 🔓 **Accès** : Gestion de leur boutique et abonnement
- 🖥️ **Dashboard** : `/marketplace/merchant-dashboard.html`
- 🛠️ **Permissions** :
  - Gestion de leur boutique en ligne
  - Suivi de l'abonnement et facturation
  - Monitoring de leur backend
  - Support tickets personnels
  - Statistiques de leur commerce

#### 4. **Customer** (`customer`)
- 🎯 **Qui** : Clients de la marketplace
- 🔓 **Accès** : Expérience d'achat et profil personnel
- 🖥️ **Dashboard** : `/marketplace/customer-dashboard.html`
- 🛠️ **Permissions** :
  - Historique des commandes
  - Gestion des favoris
  - Profil personnel
  - Communication avec les commerçants

---

## 🔧 **Architecture Technique**

### **Fichiers Clés**

#### **Configuration**
- `config/plugins.js` - Configuration des plugins d'authentification
- `config/middlewares.js` - Middlewares de sécurité
- `src/middlewares/auth-middleware.js` - Middleware d'authentification personnalisé

#### **API d'Authentification**
- `src/api/auth/controllers/auth.js` - Contrôleur d'authentification
- `src/api/auth/routes/auth.js` - Routes d'authentification
- `scripts/init-auth.js` - Script d'initialisation des rôles et utilisateurs

#### **Interfaces Utilisateur**
- `public/marketplace/auth.html` - Page de connexion/inscription
- `public/marketplace/platform-admin.html` - Dashboard Super Admin
- `public/marketplace/commercial-dashboard.html` - Dashboard Commercial
- `public/marketplace/merchant-dashboard.html` - Dashboard Commerçant
- `public/marketplace/customer-dashboard.html` - Dashboard Client

---

## 🚀 **APIs d'Authentification**

### **Endpoints Principaux**

#### **Connexion/Inscription**
```javascript
POST /api/auth/login
// Body: { identifier: "email", password: "password" }
// Response: { jwt: "token", user: {...}, redirectUrl: "dashboard", role: "type" }

POST /api/auth/register  
// Body: { username: "nom", email: "email", password: "password", userType: "customer|merchant" }
// Response: { jwt: "token", user: {...}, message: "success" }
```

#### **Gestion du Profil**
```javascript
GET /api/auth/me
// Headers: Authorization: Bearer <token>
// Response: { user: {...} }

PUT /api/auth/profile
// Headers: Authorization: Bearer <token>
// Body: { firstName: "nom", lastName: "prénom", phone: "tel", address: "adresse" }
// Response: { user: {...}, message: "success" }

POST /api/auth/logout
// Headers: Authorization: Bearer <token>
// Response: { message: "success" }
```

---

## 🛡️ **Sécurité et Permissions**

### **Middleware d'Authentification**

Le middleware `auth-middleware.js` gère automatiquement :

#### **Routes Publiques** (sans authentification)
- `/api/auth/local` - Connexion
- `/api/auth/local/register` - Inscription
- `/api/subscription-plans` - Plans d'abonnement
- `/api/products` - Produits
- `/api/categories` - Catégories
- `/marketplace/` - Pages publiques
- `/admin` - Administration Strapi
- `/uploads` - Fichiers statiques

#### **Routes Protégées par Rôle**

##### **Super Admin uniquement**
- `/api/platform/` (sauf merchant dashboard)
- Gestion complète de la plateforme

##### **Commercial + Super Admin**
- `/api/commercial/`
- `/api/platform/onboard-merchant`
- Fonctionnalités de vente et onboarding

##### **Merchant + Admins**
- `/api/merchant-backends`
- `/api/subscriptions`
- Avec vérification d'appartenance des données

##### **Customer**
- `/api/orders`
- `/api/cart`
- Avec vérification d'appartenance des données

---

## 🗂️ **Workflow d'Authentification**

### **1. Première Visite**
```
Marketplace → Bouton "Connexion" → auth.html
```

### **2. Inscription**
```
auth.html → Choix du rôle (Client/Commerçant) → Formulaire → Création compte → Auto-connexion → Dashboard
```

### **3. Connexion**
```
auth.html → Email/Password → Vérification → JWT Token → Redirection selon rôle
```

### **4. Navigation Protégée**
```
Chaque requête → Vérification JWT → Vérification permissions → Autorisation/Refus
```

---

## 🎭 **Données de Test**

### **Comptes Pré-créés**

```javascript
// Super Admin
Email: admin@localement-votre.fr
Password: Admin123!
Dashboard: /marketplace/platform-admin.html

// Commercial  
Email: commercial@localement-votre.fr
Password: Commercial123!
Dashboard: /marketplace/commercial-dashboard.html

// Commerçant de Test
Email: merchant@test.fr
Password: Merchant123!
Dashboard: /marketplace/merchant-dashboard.html

// Client de Test
Email: customer@test.fr  
Password: Customer123!
Dashboard: /marketplace/customer-dashboard.html
```

### **Plans d'Abonnement**
- **Starter** : 19.99€/mois (50 produits, 100 commandes)
- **Business** : 49.99€/mois (200 produits, 500 commandes)
- **Enterprise** : 99.99€/mois (illimité)

---

## 🔄 **Fonctionnalités Avancées**

### **Gestion des Sessions**
- Tokens JWT avec expiration 7 jours
- Détection automatique de connexion existante
- Redirection intelligente selon le rôle

### **Sécurité Renforcée**
- Hashage bcrypt des mots de passe
- Validation des permissions par route
- Logs d'audit des accès administrateurs
- Protection CORS et rate limiting

### **UX Optimisée**
- Détection du statut de connexion sur la marketplace
- Redirection automatique vers le bon dashboard
- Interface d'inscription avec sélection de rôle
- Messages d'erreur explicites

---

## 🚀 **Utilisation**

### **Pour Démarrer**
1. Le serveur Strapi est déjà configuré avec les rôles
2. Les comptes de test sont pré-créés
3. Accédez à `/marketplace/auth.html` pour vous connecter

### **Pour Tester**
1. **Client** : Connectez-vous avec `customer@test.fr`
2. **Commerçant** : Connectez-vous avec `merchant@test.fr`  
3. **Commercial** : Connectez-vous avec `commercial@localement-votre.fr`
4. **Admin** : Connectez-vous avec `admin@localement-votre.fr`

### **Workflow Complet**
```
Marketplace → Connexion → Dashboard selon rôle → Fonctionnalités spécialisées
```

---

## ✅ **Résultat**

**Système d'authentification et de gestion des rôles complet et opérationnel** avec :

- ✅ **4 niveaux d'accès** bien définis
- ✅ **Dashboards spécialisés** pour chaque rôle  
- ✅ **Sécurité renforcée** avec middlewares et JWT
- ✅ **UX fluide** avec redirection automatique
- ✅ **APIs complètes** pour toutes les opérations
- ✅ **Données de test** prêtes à utiliser

Le système est **prêt pour la production** ! 🎉
