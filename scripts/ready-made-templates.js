const templates = [
  {
    name: "E-commerce Moderne",
    description: "Template moderne pour boutique en ligne avec design épuré",
    category: "ecommerce",
    type: "ecommerce",
    framework: "Bootstrap",
    price: 0,
    rating: 4.8,
    downloads: 245,
    tags: "ecommerce,boutique,moderne,responsive",
    difficulty: "Intermédiaire",
    responsive: true,
    dark_mode: false,
    premium: false,
    featured: true,
    status: "published",
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boutique Moderne</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold text-primary" href="#">
                <i class="fas fa-store me-2"></i>Ma Boutique
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="#">Accueil</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Produits</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">À propos</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
                </ul>
                <div class="d-flex">
                    <a href="#" class="btn btn-outline-primary me-2">
                        <i class="fas fa-search"></i>
                    </a>
                    <a href="#" class="btn btn-outline-primary me-2">
                        <i class="fas fa-heart"></i>
                    </a>
                    <a href="#" class="btn btn-primary">
                        <i class="fas fa-shopping-cart me-1"></i>Panier (0)
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-primary text-white py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">Découvrez nos produits exclusifs</h1>
                    <p class="lead mb-4">Une sélection soignée de produits de qualité pour tous vos besoins</p>
                    <a href="#" class="btn btn-light btn-lg">Voir la collection</a>
                </div>
                <div class="col-lg-6">
                    <div class="bg-light rounded-3 p-5 text-center text-dark">
                        <i class="fas fa-gift fa-5x mb-3"></i>
                        <h3>Promotion spéciale</h3>
                        <p>-20% sur votre première commande</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Produits -->
    <section class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Nos produits populaires</h2>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="bg-light" style="height: 250px;">
                            <div class="d-flex align-items-center justify-content-center h-100">
                                <i class="fas fa-image fa-3x text-muted"></i>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Produit 1</h5>
                            <p class="card-text">Description du produit...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-primary">29,99 €</span>
                                <button class="btn btn-primary">Ajouter au panier</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="bg-light" style="height: 250px;">
                            <div class="d-flex align-items-center justify-content-center h-100">
                                <i class="fas fa-image fa-3x text-muted"></i>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Produit 2</h5>
                            <p class="card-text">Description du produit...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-primary">49,99 €</span>
                                <button class="btn btn-primary">Ajouter au panier</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="bg-light" style="height: 250px;">
                            <div class="d-flex align-items-center justify-content-center h-100">
                                <i class="fas fa-image fa-3x text-muted"></i>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Produit 3</h5>
                            <p class="card-text">Description du produit...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-primary">19,99 €</span>
                                <button class="btn btn-primary">Ajouter au panier</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>Ma Boutique</h5>
                    <p>Votre partenaire pour tous vos achats en ligne</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <div class="social-links">
                        <a href="#" class="text-white me-3"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-white"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <hr>
            <div class="text-center">
                <p>&copy; 2025 Ma Boutique. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`,
    css_content: `:root { --primary-color: #007bff; } .btn-primary { background-color: var(--primary-color); } .text-primary { color: var(--primary-color) !important; }`
  },

  {
    name: "Blog Élégant",
    description: "Template de blog avec design élégant et lisible",
    category: "blog",
    type: "blog",
    framework: "Bootstrap",
    price: 0,
    rating: 4.6,
    downloads: 189,
    tags: "blog,article,lecture,élégant",
    difficulty: "Facile",
    responsive: true,
    dark_mode: false,
    premium: false,
    featured: false,
    status: "published",
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Blog</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">
                <i class="fas fa-pen-fancy me-2"></i>Mon Blog
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="#">Accueil</a>
                <a class="nav-link" href="#">Articles</a>
                <a class="nav-link" href="#">À propos</a>
                <a class="nav-link" href="#">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="bg-primary text-white py-5">
        <div class="container text-center">
            <h1 class="display-4">Bienvenue sur mon blog</h1>
            <p class="lead">Découvrez mes derniers articles et réflexions</p>
        </div>
    </section>

    <!-- Articles -->
    <div class="container my-5">
        <div class="row">
            <div class="col-lg-8">
                <article class="card mb-4">
                    <div class="card-body">
                        <h2 class="card-title">Mon premier article</h2>
                        <p class="text-muted">
                            <i class="fas fa-calendar me-2"></i>20 août 2025
                            <i class="fas fa-user ms-3 me-2"></i>Auteur
                        </p>
                        <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
                        <a href="#" class="btn btn-primary">Lire la suite</a>
                    </div>
                </article>

                <article class="card mb-4">
                    <div class="card-body">
                        <h2 class="card-title">Deuxième article</h2>
                        <p class="text-muted">
                            <i class="fas fa-calendar me-2"></i>18 août 2025
                            <i class="fas fa-user ms-3 me-2"></i>Auteur
                        </p>
                        <p class="card-text">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...</p>
                        <a href="#" class="btn btn-primary">Lire la suite</a>
                    </div>
                </article>
            </div>

            <div class="col-lg-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5><i class="fas fa-search me-2"></i>Recherche</h5>
                    </div>
                    <div class="card-body">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Rechercher...">
                            <button class="btn btn-primary">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h5><i class="fas fa-tags me-2"></i>Catégories</h5>
                    </div>
                    <div class="card-body">
                        <a href="#" class="badge bg-primary me-1 mb-1">Technologie</a>
                        <a href="#" class="badge bg-success me-1 mb-1">Lifestyle</a>
                        <a href="#" class="badge bg-warning me-1 mb-1">Voyage</a>
                        <a href="#" class="badge bg-info me-1 mb-1">Cuisine</a>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-clock me-2"></i>Articles récents</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="#" class="text-decoration-none">Premier article</a></li>
                            <li class="mb-2"><a href="#" class="text-decoration-none">Deuxième article</a></li>
                            <li><a href="#" class="text-decoration-none">Troisième article</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white py-3">
        <div class="container text-center">
            <p>&copy; 2025 Mon Blog. Tous droits réservés.</p>
        </div>
    </footer>
</body>
</html>`,
    css_content: `body { font-family: 'Georgia', serif; } .card { border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }`
  },

  {
    name: "Portfolio Créatif",
    description: "Template portfolio pour présenter vos projets créatifs",
    category: "creative",
    type: "portfolio",
    framework: "Bootstrap",
    price: 0,
    rating: 4.9,
    downloads: 312,
    tags: "portfolio,créatif,projets,design",
    difficulty: "Intermédiaire",
    responsive: true,
    dark_mode: true,
    premium: false,
    featured: true,
    status: "published",
    html_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Créatif</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-white">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">Portfolio</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="#about">À propos</a>
                <a class="nav-link" href="#portfolio">Portfolio</a>
                <a class="nav-link" href="#contact">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="min-vh-100 d-flex align-items-center" style="background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);">
        <div class="container text-center">
            <h1 class="display-2 fw-bold mb-4">John Doe</h1>
            <h3 class="mb-4">Designer Créatif</h3>
            <p class="lead mb-5">Je crée des expériences visuelles uniques et mémorables</p>
            <a href="#portfolio" class="btn btn-light btn-lg rounded-pill px-5">
                Voir mes projets
            </a>
        </div>
    </section>

    <!-- À propos -->
    <section id="about" class="py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h2 class="display-5 mb-4">À propos de moi</h2>
                    <p class="lead">Passionné de design depuis plus de 5 ans, je transforme les idées en créations visuelles impactantes.</p>
                    <div class="row mt-4">
                        <div class="col-sm-6">
                            <h4>Skills</h4>
                            <ul class="list-unstyled">
                                <li><i class="fas fa-check text-primary me-2"></i>Design Graphique</li>
                                <li><i class="fas fa-check text-primary me-2"></i>UI/UX Design</li>
                                <li><i class="fas fa-check text-primary me-2"></i>Branding</li>
                            </ul>
                        </div>
                        <div class="col-sm-6">
                            <h4>Outils</h4>
                            <ul class="list-unstyled">
                                <li><i class="fab fa-figma text-primary me-2"></i>Figma</li>
                                <li><i class="fas fa-palette text-primary me-2"></i>Photoshop</li>
                                <li><i class="fas fa-vector-square text-primary me-2"></i>Illustrator</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="bg-primary rounded-3 p-5 text-center">
                        <i class="fas fa-user-circle fa-5x mb-3"></i>
                        <h4>Photo de profil</h4>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Portfolio -->
    <section id="portfolio" class="py-5 bg-light text-dark">
        <div class="container">
            <h2 class="text-center display-5 mb-5">Mes Projets</h2>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card bg-dark text-white">
                        <div class="bg-primary" style="height: 250px;">
                            <div class="d-flex align-items-center justify-content-center h-100">
                                <i class="fas fa-image fa-3x"></i>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5>Projet 1</h5>
                            <p>Description du projet créatif...</p>
                            <a href="#" class="btn btn-primary">Voir détails</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card bg-dark text-white">
                        <div class="bg-success" style="height: 250px;">
                            <div class="d-flex align-items-center justify-content-center h-100">
                                <i class="fas fa-image fa-3x"></i>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5>Projet 2</h5>
                            <p>Description du projet créatif...</p>
                            <a href="#" class="btn btn-success">Voir détails</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card bg-dark text-white">
                        <div class="bg-warning" style="height: 250px;">
                            <div class="d-flex align-items-center justify-content-center h-100">
                                <i class="fas fa-image fa-3x"></i>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5>Projet 3</h5>
                            <p>Description du projet créatif...</p>
                            <a href="#" class="btn btn-warning">Voir détails</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-5">
        <div class="container text-center">
            <h2 class="display-5 mb-5">Travaillons ensemble</h2>
            <p class="lead mb-4">Vous avez un projet en tête ? Contactez-moi !</p>
            <a href="mailto:contact@johndoe.com" class="btn btn-primary btn-lg me-3">
                <i class="fas fa-envelope me-2"></i>Email
            </a>
            <a href="#" class="btn btn-outline-light btn-lg">
                <i class="fab fa-linkedin me-2"></i>LinkedIn
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black py-3">
        <div class="container text-center">
            <p>&copy; 2025 John Doe. Portfolio créatif.</p>
        </div>
    </footer>
</body>
</html>`,
    css_content: `body { font-family: 'Arial', sans-serif; } .navbar { background: rgba(0,0,0,0.9) !important; } .card { transition: transform 0.3s; } .card:hover { transform: translateY(-5px); }`
  }
];

// Fonction pour créer les templates
async function createTemplates() {
  console.log('🚀 Création des templates prêts à l\'emploi...');
  
  for (const template of templates) {
    try {
      const response = await fetch('http://localhost:1337/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: template })
      });
      
      if (response.ok) {
        console.log(`✅ Template "${template.name}" créé avec succès`);
      } else {
        console.log(`❌ Erreur lors de la création du template "${template.name}"`);
      }
    } catch (error) {
      console.log(`❌ Erreur de connexion pour "${template.name}":`, error.message);
    }
  }
  
  console.log('🎉 Tous les templates ont été traités !');
}

// Exporter pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { templates, createTemplates };
} else {
  // Pour utilisation dans le navigateur
  window.templatesData = { templates, createTemplates };
}
