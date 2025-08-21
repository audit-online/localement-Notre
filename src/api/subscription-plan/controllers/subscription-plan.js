'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscription-plan.subscription-plan', ({ strapi }) => ({
  
  // Obtenir tous les plans actifs
  async findActive(ctx) {
    try {
      const plans = await strapi.entityService.findMany('api::subscription-plan.subscription-plan', {
        filters: { isActive: true },
        sort: { sortOrder: 'asc' },
        populate: ['subscriptions']
      });
      
      ctx.body = { data: plans };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
  
  // Créer un plan avec prix Stripe
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // Créer le prix dans Stripe
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      const stripePrice = await stripe.prices.create({
        currency: data.currency || 'eur',
        unit_amount: Math.round(data.price * 100), // Stripe utilise les centimes
        recurring: {
          interval: data.billingPeriod === 'yearly' ? 'year' : 'month',
          interval_count: data.billingPeriod === 'quarterly' ? 3 : 1
        },
        product_data: {
          name: data.name,
          description: data.description
        },
        metadata: {
          planName: data.name,
          features: JSON.stringify(data.features || {})
        }
      });
      
      // Créer le plan dans la base
      const plan = await strapi.entityService.create('api::subscription-plan.subscription-plan', {
        data: {
          ...data,
          stripePriceId: stripePrice.id,
          publishedAt: new Date()
        }
      });
      
      ctx.body = { data: plan };
      
    } catch (error) {
      console.error('Erreur création plan:', error);
      ctx.throw(500, 'Erreur lors de la création du plan');
    }
  },
  
  // Mettre à jour un plan
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      
      // Si le prix change, créer un nouveau prix Stripe
      let stripePriceId = data.stripePriceId;
      
      if (data.price && (!data.stripePriceId || data.forceNewPrice)) {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        const stripePrice = await stripe.prices.create({
          currency: data.currency || 'eur',
          unit_amount: Math.round(data.price * 100),
          recurring: {
            interval: data.billingPeriod === 'yearly' ? 'year' : 'month',
            interval_count: data.billingPeriod === 'quarterly' ? 3 : 1
          },
          product_data: {
            name: data.name,
            description: data.description
          }
        });
        
        stripePriceId = stripePrice.id;
      }
      
      const plan = await strapi.entityService.update('api::subscription-plan.subscription-plan', id, {
        data: {
          ...data,
          stripePriceId
        }
      });
      
      ctx.body = { data: plan };
      
    } catch (error) {
      console.error('Erreur mise à jour plan:', error);
      ctx.throw(500, 'Erreur lors de la mise à jour du plan');
    }
  }
  
}));
