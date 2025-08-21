# 🏪 Localement Vôtre - Marketplace Local

## 📋 Description

**Localement Vôtre** est une plateforme marketplace dédiée aux commerçants et artisans locaux. Elle permet aux entreprises locales de vendre leurs produits et services en ligne tout en gardant un lien fort avec leur communauté.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités Actuelles
- **Gestion des Boutiques** : Création et gestion de profils commerçants
- **Catalogue Produits** : Affichage et gestion des produits et services
- **Interface Responsive** : Design adaptatif pour tous les appareils
- **Template System** : Système de templates pour créer des mini-sites
- **Gestion des Images** : Stockage local d'images optimisées

### 🔧 Fonctionnalités en Développement
- **Panier d'Achat** : Système de commande intégré
- **Espace Client** : Gestion des comptes utilisateurs
- **Paiement Sécurisé** : Intégration de solutions de paiement
- **Click & Collect** : Système de retrait en magasin
- **Formulaires de Contact** : Communication directe avec les commerçants

## 🛠️ Technologies

- **Backend** : Strapi V5.22.0 (Headless CMS)
- **Base de données** : SQLite (développement)
- **Frontend** : HTML5, CSS3, Bootstrap 5.3.0
- **Icons** : Font Awesome 6.0.0
- **Environnement** : Node.js, npm

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/localement-votre.git

# Accéder au dossier
cd localement-votre

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run develop
```

## 🏃‍♂️ Démarrage Rapide

1. **Installation des dépendances** :
   ```bash
   npm install
   ```

2. **Démarrage du serveur** :
   ```bash
   npm run develop
   ```

3. **Accès à l'interface** :
   - Frontend : `http://localhost:1337`
   - Admin Strapi : `http://localhost:1337/admin`

## 📁 Structure du Projet

```
marketplace/
├── config/                 # Configuration Strapi
├── database/              # Migrations de base de données
├── public/                # Fichiers statiques
│   ├── marketplace/       # Interface utilisateur
│   └── uploads/           # Images uploadées
├── src/
│   ├── api/              # APIs et contrôleurs
│   │   ├── boutique/     # Gestion des boutiques
│   │   ├── plan/         # Gestion des plans
│   │   └── template/     # Gestion des templates
│   └── admin/            # Interface d'administration
└── types/                # Définitions TypeScript
```

## 🎯 Roadmap

### Phase 1 - ✅ Complétée
- [x] Configuration Strapi V5
- [x] Modèles de données (Boutique, Plan, Template)
- [x] Interface frontend de base
- [x] Système de templates

### Phase 2 - 🚧 En Cours
- [ ] Système de panier
- [ ] Gestion des comptes clients
- [ ] Intégration paiement
- [ ] Click & Collect

### Phase 3 - 📋 Planifiée
- [ ] Tableau de bord commerçant
- [ ] Analytics et statistiques
- [ ] Système de notifications
- [ ] Application mobile

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

- **Projet** : Localement Vôtre
- **Objectif** : Soutenir le commerce local et l'artisanat français
- **Vision** : Créer un écosystème numérique pour les commerçants locaux

---

*Développé avec ❤️ pour soutenir les commerçants et artisans locaux*

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
