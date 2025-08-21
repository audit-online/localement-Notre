'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::customer.customer', ({ strapi }) => ({
  // Obtenir le profil client de l'utilisateur connecté
  async me(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    let customer = await strapi.entityService.findMany('api::customer.customer', {
      filters: { user: user.id },
      populate: ['avatar']
    });

    if (!customer || customer.length === 0) {
      // Créer un profil client automatiquement
      customer = await strapi.entityService.create('api::customer.customer', {
        data: {
          user: user.id,
          firstName: user.username || '',
          lastName: '',
          isActive: true,
          loyaltyPoints: 0,
          totalSpent: 0
        },
        populate: ['avatar']
      });
    } else {
      customer = customer[0];
    }

    return { data: customer };
  },

  // Mettre à jour le profil client
  async updateProfile(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    const { firstName, lastName, phone, birthDate, addresses, preferences, newsletterSubscribed } = ctx.request.body;

    let customer = await strapi.entityService.findMany('api::customer.customer', {
      filters: { user: user.id }
    });

    if (!customer || customer.length === 0) {
      return ctx.notFound('Profil client non trouvé');
    }

    customer = customer[0];

    const updatedCustomer = await strapi.entityService.update('api::customer.customer', customer.id, {
      data: {
        firstName,
        lastName,
        phone,
        birthDate,
        addresses,
        preferences,
        newsletterSubscribed,
        lastLoginDate: new Date()
      },
      populate: ['avatar']
    });

    return { data: updatedCustomer };
  },

  // Obtenir l'historique des commandes
  async orders(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    const orders = await strapi.entityService.findMany('api::order.order', {
      filters: { user: user.id },
      populate: {
        items: {
          populate: {
            product: {
              populate: ['images']
            }
          }
        },
        merchant: true
      },
      sort: { createdAt: 'desc' }
    });

    return { data: orders };
  },

  // Ajouter des points de fidélité
  async addLoyaltyPoints(ctx) {
    const { customerId, points } = ctx.request.body;

    if (!customerId || !points) {
      return ctx.badRequest('Customer ID et points requis');
    }

    const customer = await strapi.entityService.findOne('api::customer.customer', customerId);
    if (!customer) {
      return ctx.notFound('Client non trouvé');
    }

    const updatedCustomer = await strapi.entityService.update('api::customer.customer', customerId, {
      data: {
        loyaltyPoints: customer.loyaltyPoints + points
      }
    });

    return { data: updatedCustomer };
  }
}));
