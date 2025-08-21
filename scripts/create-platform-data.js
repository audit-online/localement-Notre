const createSubscriptionPlans = async () => {
  console.log('🔄 Création des plans d\'abonnement...');
  
  const plans = [
    {
      name: 'Starter',
      slug: 'starter',
      description: 'Parfait pour débuter votre activité en ligne',
      price: 19.99,
      currency: 'EUR',
      billingPeriod: 'monthly',
      trialDays: 14,
      isActive: true,
      features: {
        maxProducts: 50,
        maxOrders: 100,
        storage: '1GB',
        customDomain: false,
        analytics: 'basiques',
        support: 'email'
      },
      maxProducts: 50,
      maxOrders: 100,
      maxStorage: 1024, // MB
      customDomain: false,
      advancedAnalytics: false,
      prioritySupport: false,
      sortOrder: 1
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Pour les commerçants qui veulent développer leur activité',
      price: 49.99,
      currency: 'EUR',
      billingPeriod: 'monthly',
      trialDays: 14,
      isActive: true,
      features: {
        maxProducts: 500,
        maxOrders: 1000,
        storage: '10GB',
        customDomain: true,
        analytics: 'avancées',
        support: 'prioritaire'
      },
      maxProducts: 500,
      maxOrders: 1000,
      maxStorage: 10240, // MB
      customDomain: true,
      advancedAnalytics: true,
      prioritySupport: true,
      sortOrder: 2
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Solution complète pour les grandes entreprises',
      price: 99.99,
      currency: 'EUR',
      billingPeriod: 'monthly',
      trialDays: 30,
      isActive: true,
      features: {
        maxProducts: -1, // illimité
        maxOrders: -1, // illimité
        storage: '100GB',
        customDomain: true,
        analytics: 'complètes',
        support: 'dédié'
      },
      maxProducts: -1,
      maxOrders: -1,
      maxStorage: 102400, // MB
      customDomain: true,
      advancedAnalytics: true,
      prioritySupport: true,
      sortOrder: 3
    }
  ];

  for (const planData of plans) {
    try {
      // Vérifier si le plan existe déjà
      const existingPlan = await strapi.entityService.findMany('api::subscription-plan.subscription-plan', {
        filters: { slug: planData.slug }
      });

      if (existingPlan.length === 0) {
        const plan = await strapi.entityService.create('api::subscription-plan.subscription-plan', {
          data: {
            ...planData,
            publishedAt: new Date()
          }
        });
        console.log(`✅ Plan créé: ${plan.name}`);
      } else {
        console.log(`⚠️ Plan déjà existant: ${planData.name}`);
      }
    } catch (error) {
      console.error(`❌ Erreur création plan ${planData.name}:`, error.message);
    }
  }
};

const createSampleMerchantWithBackend = async () => {
  console.log('🔄 Création d\'un commerçant de démonstration...');
  
  try {
    // Vérifier si le commerçant demo existe déjà
    const existingMerchant = await strapi.entityService.findMany('api::merchant.merchant', {
      filters: { email: 'demo@marketplace.local' }
    });
    
    if (existingMerchant.length > 0) {
      console.log('⚠️ Commerçant de démonstration déjà existant');
      return;
    }
    
    // Créer le commerçant
    const merchant = await strapi.entityService.create('api::merchant.merchant', {
      data: {
        name: 'Boutique Démo',
        email: 'demo@marketplace.local',
        phone: '01 23 45 67 89',
        address: '123 Rue de la Démo',
        city: 'Paris',
        postalCode: '75001',
        businessType: 'commerce',
        description: 'Boutique de démonstration pour tester la plateforme',
        website: 'https://demo.marketplace.local',
        isActive: true,
        joinedAt: new Date(),
        publishedAt: new Date()
      }
    });
    
    // Récupérer le plan Starter
    const starterPlan = await strapi.entityService.findMany('api::subscription-plan.subscription-plan', {
      filters: { slug: 'starter' }
    });
    
    if (starterPlan.length > 0) {
      // Créer l'abonnement
      const subscription = await strapi.entityService.create('api::subscription.subscription', {
        data: {
          merchant: merchant.id,
          plan: starterPlan[0].id,
          status: 'trialing',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
          nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours trial
          amount: starterPlan[0].price,
          currency: starterPlan[0].currency,
          trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          autoRenew: true,
          publishedAt: new Date()
        }
      });
      
      // Créer le backend
      const backend = await strapi.entityService.create('api::merchant-backend.merchant-backend', {
        data: {
          merchant: merchant.id,
          subdomain: 'demo-boutique',
          status: 'active',
          apiEndpoint: 'https://demo-boutique.marketplace.local/api',
          adminUrl: 'https://demo-boutique.marketplace.local/admin',
          version: '1.0.0',
          isSSLEnabled: true,
          healthStatus: 'healthy',
          lastHealthCheck: new Date(),
          publishedAt: new Date()
        }
      });
      
      console.log(`✅ Commerçant demo créé: ${merchant.name}`);
      console.log(`✅ Abonnement créé: ${subscription.status}`);
      console.log(`✅ Backend créé: ${backend.subdomain}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur création commerçant demo:', error.message);
  }
};

const createSampleTickets = async () => {
  console.log('🔄 Création de tickets de démonstration...');
  
  try {
    // Récupérer le commerçant demo
    const merchant = await strapi.entityService.findMany('api::merchant.merchant', {
      filters: { email: 'demo@marketplace.local' }
    });
    
    if (merchant.length === 0) {
      console.log('⚠️ Commerçant demo non trouvé');
      return;
    }
    
    const tickets = [
      {
        title: 'Problème de connexion à l\'administration',
        description: 'Je n\'arrive pas à me connecter à mon espace d\'administration depuis ce matin.',
        category: 'technical',
        priority: 'high',
        status: 'open',
        customerEmail: 'demo@marketplace.local'
      },
      {
        title: 'Question sur la facturation',
        description: 'J\'aimerais savoir quand sera prélevé mon prochain abonnement.',
        category: 'billing',
        priority: 'medium',
        status: 'in_progress',
        customerEmail: 'demo@marketplace.local'
      }
    ];
    
    for (const ticketData of tickets) {
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const ticket = await strapi.entityService.create('api::support-ticket.support-ticket', {
        data: {
          ...ticketData,
          ticketNumber,
          merchant: merchant[0].id,
          lastActivityAt: new Date(),
          publishedAt: new Date()
        }
      });
      
      console.log(`✅ Ticket créé: ${ticket.ticketNumber}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur création tickets:', error.message);
  }
};

module.exports = {
  createSubscriptionPlans,
  createSampleMerchantWithBackend,
  createSampleTickets
};
