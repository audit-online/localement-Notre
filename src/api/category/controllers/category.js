'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  // Trouver toutes les catégories avec population
  async find(ctx) {
    try {
      const categories = await strapi.entityService.findMany('api::category.category', {
        ...ctx.query,
        populate: {
          icon: true,
          products: true
        }
      });

      ctx.body = { data: categories };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));
