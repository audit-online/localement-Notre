'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscription.subscription', ({ strapi }) => ({
  
  // Créer un nouvel abonnement
  async create(ctx) {
    try {
      const { merchantId, planId, paymentMethodId } = ctx.request.body.data;
      
      // Vérifier que le merchant et le plan existent
      const merchant = await strapi.entityService.findOne('api::merchant.merchant', merchantId);
      const plan = await strapi.entityService.findOne('api::subscription-plan.subscription-plan', planId);
      
      if (!merchant || !plan) {
        return ctx.badRequest('Merchant ou plan introuvable');
      }
      
      // Vérifier qu'il n'y a pas déjà un abonnement actif
      const existingSubscription = await strapi.entityService.findMany('api::subscription.subscription', {
        filters: {
          merchant: merchantId,
          status: { $in: ['active', 'pending'] }
        }
      });
      
      if (existingSubscription.length > 0) {
        return ctx.badRequest('Le merchant a déjà un abonnement actif');
      }
      
      // Créer l'abonnement dans Stripe
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      // Créer ou récupérer le customer Stripe
      let stripeCustomerId = merchant.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: merchant.email,
          name: merchant.name,
          metadata: {
            merchantId: merchant.id.toString()
          }
        });
        stripeCustomerId = customer.id;
        
        // Mettre à jour le merchant avec l'ID Stripe
        await strapi.entityService.update('api::merchant.merchant', merchantId, {
          data: { stripeCustomerId }
        });
      }
      
      // Attacher le mode de paiement au customer
      if (paymentMethodId) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomerId,
        });
        
        // Définir comme mode de paiement par défaut
        await stripe.customers.update(stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }
      
      // Créer l'abonnement Stripe
      const stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: plan.stripePriceId }],
        trial_period_days: plan.trialDays > 0 ? plan.trialDays : undefined,
        metadata: {
          merchantId: merchant.id.toString(),
          planId: plan.id.toString()
        }
      });
      
      // Créer l'abonnement dans la base
      const subscription = await strapi.entityService.create('api::subscription.subscription', {
        data: {
          merchant: merchantId,
          plan: planId,
          status: stripeSubscription.status === 'trialing' ? 'active' : stripeSubscription.status,
          startDate: new Date(stripeSubscription.current_period_start * 1000),
          endDate: new Date(stripeSubscription.current_period_end * 1000),
          nextBillingDate: new Date(stripeSubscription.current_period_end * 1000),
          amount: plan.price,
          currency: plan.currency,
          stripeSubscriptionId: stripeSubscription.id,
          trialEndDate: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
          autoRenew: true,
          publishedAt: new Date()
        },
        populate: ['merchant', 'plan']
      });
      
      ctx.body = { data: subscription };
      
    } catch (error) {
      console.error('Erreur création abonnement:', error);
      ctx.throw(500, 'Erreur lors de la création de l\'abonnement');
    }
  },
  
  // Annuler un abonnement
  async cancel(ctx) {
    try {
      const { id } = ctx.params;
      const { reason } = ctx.request.body;
      
      const subscription = await strapi.entityService.findOne('api::subscription.subscription', id, {
        populate: ['merchant']
      });
      
      if (!subscription) {
        return ctx.notFound('Abonnement introuvable');
      }
      
      // Annuler dans Stripe
      if (subscription.stripeSubscriptionId) {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      }
      
      // Mettre à jour l'abonnement
      const updatedSubscription = await strapi.entityService.update('api::subscription.subscription', id, {
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason || 'Annulation demandée par le client',
          autoRenew: false
        },
        populate: ['merchant', 'plan']
      });
      
      ctx.body = { data: updatedSubscription };
      
    } catch (error) {
      console.error('Erreur annulation abonnement:', error);
      ctx.throw(500, 'Erreur lors de l\'annulation de l\'abonnement');
    }
  },
  
  // Obtenir les statistiques des abonnements
  async getStats(ctx) {
    try {
      const totalSubscriptions = await strapi.entityService.count('api::subscription.subscription');
      const activeSubscriptions = await strapi.entityService.count('api::subscription.subscription', {
        filters: { status: 'active' }
      });
      const trialSubscriptions = await strapi.entityService.count('api::subscription.subscription', {
        filters: { status: 'trialing' }
      });
      const cancelledSubscriptions = await strapi.entityService.count('api::subscription.subscription', {
        filters: { status: 'cancelled' }
      });
      
      // Revenus mensuels
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const monthlySubscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
        filters: {
          status: 'active',
          nextBillingDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      });
      
      const monthlyRevenue = monthlySubscriptions.reduce((sum, sub) => sum + parseFloat(sub.amount || 0), 0);
      
      ctx.body = {
        data: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          trial: trialSubscriptions,
          cancelled: cancelledSubscriptions,
          monthlyRevenue,
          conversionRate: totalSubscriptions > 0 ? (activeSubscriptions / totalSubscriptions * 100).toFixed(2) : 0
        }
      };
      
    } catch (error) {
      console.error('Erreur stats abonnements:', error);
      ctx.throw(500, error.message);
    }
  }
  
}));
