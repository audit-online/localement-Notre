'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::marketplace.marketplace', ({ strapi }) => ({
  
  // Dashboard principal de la plateforme
  async platformDashboard(ctx) {
    try {
      // Statistiques des commerçants
      const totalMerchants = await strapi.entityService.count('api::merchant.merchant');
      const activeMerchants = await strapi.entityService.count('api::merchant.merchant', {
        filters: { isActive: true }
      });
      const newMerchantsThisMonth = await strapi.entityService.count('api::merchant.merchant', {
        filters: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      });
      
      // Statistiques des abonnements
      const activeSubscriptions = await strapi.entityService.count('api::subscription.subscription', {
        filters: { status: 'active' }
      });
      const trialSubscriptions = await strapi.entityService.count('api::subscription.subscription', {
        filters: { status: 'trialing' }
      });
      
      // Revenus mensuels
      const monthlySubscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
        filters: {
          status: { $in: ['active', 'trialing'] }
        },
        populate: ['plan']
      });
      
      const monthlyRevenue = monthlySubscriptions.reduce((sum, sub) => {
        return sum + parseFloat(sub.amount || 0);
      }, 0);
      
      // Statistiques des tickets
      const openTickets = await strapi.entityService.count('api::support-ticket.support-ticket', {
        filters: { status: { $in: ['open', 'in_progress'] } }
      });
      const urgentTickets = await strapi.entityService.count('api::support-ticket.support-ticket', {
        filters: { priority: 'urgent', status: { $ne: 'closed' } }
      });
      
      // Statistiques des backends
      const activeBackends = await strapi.entityService.count('api::merchant-backend.merchant-backend', {
        filters: { status: 'active' }
      });
      const deployingBackends = await strapi.entityService.count('api::merchant-backend.merchant-backend', {
        filters: { status: 'deploying' }
      });
      
      // Derniers commerçants inscrits
      const recentMerchants = await strapi.entityService.findMany('api::merchant.merchant', {
        sort: { createdAt: 'desc' },
        limit: 5,
        populate: ['subscription', 'backend']
      });
      
      // Derniers tickets
      const recentTickets = await strapi.entityService.findMany('api::support-ticket.support-ticket', {
        sort: { createdAt: 'desc' },
        limit: 5,
        populate: ['merchant']
      });
      
      ctx.body = {
        data: {
          merchants: {
            total: totalMerchants,
            active: activeMerchants,
            newThisMonth: newMerchantsThisMonth,
            recent: recentMerchants
          },
          subscriptions: {
            active: activeSubscriptions,
            trial: trialSubscriptions,
            monthlyRevenue: Math.round(monthlyRevenue * 100) / 100
          },
          support: {
            openTickets,
            urgentTickets,
            recent: recentTickets
          },
          backends: {
            active: activeBackends,
            deploying: deployingBackends
          }
        }
      };
      
    } catch (error) {
      console.error('Erreur dashboard plateforme:', error);
      ctx.throw(500, 'Erreur lors du chargement du dashboard');
    }
  },
  
  // Espace dédié commerçant
  async merchantDashboard(ctx) {
    try {
      const { merchantId } = ctx.params;
      
      // Vérifier que le commerçant existe
      const merchant = await strapi.entityService.findOne('api::merchant.merchant', merchantId, {
        populate: ['subscription', 'backend', 'products', 'orders']
      });
      
      if (!merchant) {
        return ctx.notFound('Commerçant introuvable');
      }
      
      // Statistiques du commerçant
      const productsCount = await strapi.entityService.count('api::product.product', {
        filters: { merchant: merchantId }
      });
      
      const ordersCount = await strapi.entityService.count('api::order.order', {
        filters: { merchant: merchantId }
      });
      
      const ticketsCount = await strapi.entityService.count('api::support-ticket.support-ticket', {
        filters: { merchant: merchantId }
      });
      
      // Dernières commandes
      const recentOrders = await strapi.entityService.findMany('api::order.order', {
        filters: { merchant: merchantId },
        sort: { createdAt: 'desc' },
        limit: 10,
        populate: ['customer', 'items']
      });
      
      // Tickets ouverts
      const openTickets = await strapi.entityService.findMany('api::support-ticket.support-ticket', {
        filters: { 
          merchant: merchantId,
          status: { $in: ['open', 'in_progress'] }
        },
        sort: { createdAt: 'desc' },
        populate: ['assignedTo']
      });
      
      ctx.body = {
        data: {
          merchant,
          stats: {
            products: productsCount,
            orders: ordersCount,
            tickets: ticketsCount
          },
          recentOrders,
          openTickets,
          subscription: merchant.subscription,
          backend: merchant.backend
        }
      };
      
    } catch (error) {
      console.error('Erreur dashboard commerçant:', error);
      ctx.throw(500, 'Erreur lors du chargement du dashboard commerçant');
    }
  },
  
  // Onboarding d'un nouveau commerçant
  async onboardMerchant(ctx) {
    try {
      const { data } = ctx.request.body;
      const { merchantData, planId, subdomain, templateId } = data;
      
      // Étape 1: Créer le commerçant
      const merchant = await strapi.entityService.create('api::merchant.merchant', {
        data: {
          ...merchantData,
          joinedAt: new Date(),
          publishedAt: new Date()
        }
      });
      
      // Étape 2: Créer l'abonnement
      let subscription = null;
      if (planId) {
        const plan = await strapi.entityService.findOne('api::subscription-plan.subscription-plan', planId);
        if (plan) {
          subscription = await strapi.entityService.create('api::subscription.subscription', {
            data: {
              merchant: merchant.id,
              plan: planId,
              status: plan.trialDays > 0 ? 'trialing' : 'active',
              startDate: new Date(),
              amount: plan.price,
              currency: plan.currency,
              trialEndDate: plan.trialDays > 0 ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000) : null,
              publishedAt: new Date()
            }
          });
        }
      }
      
      // Étape 3: Créer le backend si demandé
      let backend = null;
      if (subdomain && subscription) {
        backend = await strapi.entityService.create('api::merchant-backend.merchant-backend', {
          data: {
            merchant: merchant.id,
            template: templateId,
            subdomain,
            status: 'deploying',
            apiEndpoint: `https://${subdomain}.marketplace.local/api`,
            adminUrl: `https://${subdomain}.marketplace.local/admin`,
            publishedAt: new Date()
          }
        });
        
        // Lancer le déploiement
        const merchantBackendController = strapi.controller('api::merchant-backend.merchant-backend');
        merchantBackendController.deployBackend(backend.id);
      }
      
      ctx.body = {
        data: {
          merchant,
          subscription,
          backend,
          message: 'Onboarding terminé avec succès'
        }
      };
      
    } catch (error) {
      console.error('Erreur onboarding:', error);
      ctx.throw(500, 'Erreur lors de l\'onboarding');
    }
  }
  
}));
